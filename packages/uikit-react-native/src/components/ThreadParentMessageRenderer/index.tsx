import React, { useRef } from 'react';

import { RegexTextPattern, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import {
  SendbirdFileMessage,
  type SendbirdUser,
  SendbirdUserMessage,
  getMessageType,
  isMyMessage,
  isVoiceMessage,
} from '@sendbird/uikit-utils';

import { VOICE_MESSAGE_META_ARRAY_DURATION_KEY } from '../../constants';
import { usePlatformService, useSBUHandlers, useSendbirdChat } from './../../hooks/useContext';
import ThreadParentMessageFile from './ThreadParentMessage.file';
import ThreadParentMessageFileImage from './ThreadParentMessage.file.image';
import ThreadParentMessageFileVideo from './ThreadParentMessage.file.video';
import ThreadParentMessageFileVoice, { VoiceFileMessageState } from './ThreadParentMessage.file.voice';
import ThreadParentMessageUser from './ThreadParentMessage.user';
import ThreadParentMessageUserOg from './ThreadParentMessage.user.og';

export type ThreadParentMessageRendererProps<AdditionalProps = unknown> = {
  parentMessage: SendbirdUserMessage | SendbirdFileMessage;
  onPress?: () => void;
  onLongPress?: () => void;
  onPressURL?: (url: string) => void;
  onPressMentionedUser?: (mentionedUser?: SendbirdUser) => void;
  onToggleVoiceMessage?: (
    state: VoiceFileMessageState,
    setState: React.Dispatch<React.SetStateAction<VoiceFileMessageState>>,
  ) => Promise<void>;
} & AdditionalProps;

const ThreadParentMessageRenderer = (props: ThreadParentMessageRendererProps) => {
  const handlers = useSBUHandlers();
  const playerUnsubscribes = useRef<(() => void)[]>([]);
  const { sbOptions, currentUser, mentionManager } = useSendbirdChat();
  const { palette } = useUIKitTheme();
  const { mediaService, playerService } = usePlatformService();
  const parentMessage = props.parentMessage;

  const resetPlayer = async () => {
    playerUnsubscribes.current.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch {}
    });
    playerUnsubscribes.current.length = 0;
    await playerService.reset();
  };

  const messageProps: ThreadParentMessageRendererProps = {
    onPressURL: (url) => handlers.onOpenURL(url),
    onToggleVoiceMessage: async (state, setState) => {
      if (isVoiceMessage(parentMessage) && parentMessage.sendingStatus === 'succeeded') {
        if (playerService.uri === parentMessage.url) {
          if (playerService.state === 'playing') {
            await playerService.pause();
          } else {
            await playerService.play(parentMessage.url);
          }
        } else {
          if (playerService.state !== 'idle') {
            await resetPlayer();
          }

          const shouldSeekToTime = state.duration > state.currentTime && state.currentTime > 0;
          let seekFinished = !shouldSeekToTime;

          const forPlayback = playerService.addPlaybackListener(({ stopped, currentTime, duration }) => {
            if (seekFinished) {
              setState((prevState) => ({ ...prevState, currentTime: stopped ? 0 : currentTime, duration }));
            }
          });
          const forState = playerService.addStateListener((state) => {
            switch (state) {
              case 'preparing':
                setState((prevState) => ({ ...prevState, status: 'preparing' }));
                break;
              case 'playing':
                setState((prevState) => ({ ...prevState, status: 'playing' }));
                break;
              case 'idle':
              case 'paused': {
                setState((prevState) => ({ ...prevState, status: 'paused' }));
                break;
              }
              case 'stopped':
                setState((prevState) => ({ ...prevState, status: 'paused' }));
                break;
            }
          });
          playerUnsubscribes.current.push(forPlayback, forState);

          await playerService.play(parentMessage.url);
          if (shouldSeekToTime) {
            await playerService.seek(state.currentTime);
            seekFinished = true;
          }
        }
      }
    },
    ...props,
  };

  const userMessageProps: {
    renderRegexTextChildren: (message: SendbirdUserMessage) => string;
    regexTextPatterns: RegexTextPattern[];
  } = {
    renderRegexTextChildren: (message) => {
      if (
        mentionManager.shouldUseMentionedMessageTemplate(message, sbOptions.uikit.groupChannel.channel.enableMention)
      ) {
        return message.mentionedMessageTemplate;
      } else {
        return message.message;
      }
    },
    regexTextPatterns: [
      {
        regex: mentionManager.templateRegex,
        replacer({ match, groups, parentProps, index, keyPrefix }) {
          const user = parentMessage.mentionedUsers?.find((it) => it.userId === groups[2]);
          if (user) {
            const mentionColor =
              !isMyMessage(parentMessage, currentUser?.userId) && user.userId === currentUser?.userId
                ? palette.onBackgroundLight01
                : parentProps?.color;

            return (
              <Text
                {...parentProps}
                key={`${keyPrefix}-${index}`}
                color={mentionColor}
                onPress={() => messageProps.onPressMentionedUser?.(user)}
                onLongPress={messageProps.onLongPress}
                style={[
                  parentProps?.style,
                  { fontWeight: '700' },
                  user.userId === currentUser?.userId && { backgroundColor: palette.highlight },
                ]}
              >
                {`${mentionManager.asMentionedMessageText(user)}`}
              </Text>
            );
          }
          return match;
        },
      },
    ],
  };

  switch (getMessageType(props.parentMessage)) {
    case 'user': {
      return <ThreadParentMessageUser {...userMessageProps} {...messageProps} />;
    }
    case 'user.opengraph': {
      return <ThreadParentMessageUserOg {...userMessageProps} {...messageProps} />;
    }
    case 'file':
    case 'file.audio': {
      return <ThreadParentMessageFile {...messageProps} />;
    }
    case 'file.video': {
      return (
        <ThreadParentMessageFileVideo
          fetchThumbnailFromVideoSource={(uri) => mediaService.getVideoThumbnail({ url: uri, timeMills: 1000 })}
          {...messageProps}
        />
      );
    }
    case 'file.image': {
      return <ThreadParentMessageFileImage {...messageProps} />;
    }
    case 'file.voice': {
      return (
        <ThreadParentMessageFileVoice
          durationMetaArrayKey={VOICE_MESSAGE_META_ARRAY_DURATION_KEY}
          onUnmount={() => {
            if (isVoiceMessage(parentMessage) && playerService.uri === parentMessage.url) {
              resetPlayer().catch((_) => {});
            }
          }}
          {...messageProps}
        />
      );
    }
    default: {
      return null;
    }
  }
};

export default React.memo(ThreadParentMessageRenderer);
