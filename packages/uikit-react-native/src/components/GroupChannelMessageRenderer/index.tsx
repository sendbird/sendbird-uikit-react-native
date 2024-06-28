import React, { useContext, useEffect, useRef } from 'react';

import type { GroupChannelMessageProps, RegexTextPattern } from '@sendbird/uikit-react-native-foundation';
import {
  Box,
  GroupChannelMessage,
  Text,
  TypingIndicatorBubble,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {
  SendbirdAdminMessage,
  SendbirdFileMessage,
  SendbirdMessage,
  SendbirdUserMessage,
  calcMessageGrouping,
  getMessageType,
  isMyMessage,
  isVoiceMessage,
  shouldRenderParentMessage,
  shouldRenderReaction,
  useIIFE,
} from '@sendbird/uikit-utils';

import { VOICE_MESSAGE_META_ARRAY_DURATION_KEY } from '../../constants';
import { GroupChannelContexts } from '../../domain/groupChannel/module/moduleContext';
import type { GroupChannelProps } from '../../domain/groupChannel/types';
import { useLocalization, usePlatformService, useSendbirdChat } from '../../hooks/useContext';
import SBUUtils from '../../libs/SBUUtils';
import { TypingIndicatorType } from '../../types';
import { ReactionAddons } from '../ReactionAddons';
import GroupChannelMessageDateSeparator from './GroupChannelMessageDateSeparator';
import GroupChannelMessageFocusAnimation from './GroupChannelMessageFocusAnimation';
import GroupChannelMessageOutgoingStatus from './GroupChannelMessageOutgoingStatus';
import GroupChannelMessageParentMessage from './GroupChannelMessageParentMessage';
import GroupChannelMessageReplyInfo from './GroupChannelMessageReplyInfo';

const GroupChannelMessageRenderer: GroupChannelProps['Fragment']['renderMessage'] = ({
  channel,
  message,
  onPress,
  onLongPress,
  onPressParentMessage,
  onShowUserProfile,
  onReplyInThreadMessage,
  enableMessageGrouping,
  focused,
  prevMessage,
  nextMessage,
  hideParentMessage,
}) => {
  const playerUnsubscribes = useRef<(() => void)[]>([]);
  const { palette } = useUIKitTheme();
  const { sbOptions, currentUser, mentionManager, voiceMessageStatusManager } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { mediaService, playerService } = usePlatformService();
  const { groupWithPrev, groupWithNext } = calcMessageGrouping(
    Boolean(enableMessageGrouping),
    message,
    prevMessage,
    nextMessage,
    sbOptions.uikit.groupChannel.channel.replyType === 'thread',
    shouldRenderParentMessage(message, hideParentMessage),
  );

  const variant = isMyMessage(message, currentUser?.userId) ? 'outgoing' : 'incoming';

  const reactionChildren = useIIFE(() => {
    const configs = sbOptions.uikitWithAppInfo.groupChannel.channel;
    if (
      shouldRenderReaction(channel, channel.isSuper ? configs.enableReactionsSupergroup : configs.enableReactions) &&
      message.reactions &&
      message.reactions.length > 0
    ) {
      return <ReactionAddons.Message channel={channel} message={message} />;
    }
    return null;
  });

  const replyInfo = useIIFE(() => {
    if (sbOptions.uikit.groupChannel.channel.replyType !== 'thread') return null;
    if (!channel || !message.threadInfo || !message.threadInfo.replyCount) return null;
    return <GroupChannelMessageReplyInfo channel={channel} message={message} onPress={onReplyInThreadMessage} />;
  });

  const resetPlayer = async () => {
    playerUnsubscribes.current.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch {}
    });
    playerUnsubscribes.current.length = 0;
    await playerService.reset();
  };

  const messageProps: Omit<GroupChannelMessageProps<SendbirdMessage>, 'message'> = {
    channel,
    variant,
    onPress,
    onLongPress,
    onPressURL: (url) => SBUUtils.openURL(url),
    onPressAvatar: () => {
      if ('sender' in message) onShowUserProfile?.(message.sender);
    },
    onPressMentionedUser: (mentionedUser) => {
      if (mentionedUser) onShowUserProfile?.(mentionedUser);
    },
    onToggleVoiceMessage: async (state, setState) => {
      if (isVoiceMessage(message) && message.sendingStatus === 'succeeded') {
        if (playerService.uri === message.url) {
          if (playerService.state === 'playing') {
            await playerService.pause();
          } else {
            await playerService.play(message.url);
          }
        } else {
          if (playerService.state !== 'idle') {
            await resetPlayer();
          }

          const shouldSeekToTime = state.duration > state.currentTime && state.currentTime > 0;
          let seekFinished = !shouldSeekToTime;

          const forPlayback = playerService.addPlaybackListener(({ stopped, currentTime, duration }) => {
            voiceMessageStatusManager.setCurrentTime(message.channelUrl, message.messageId, currentTime);
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

          await playerService.play(message.url);
          if (shouldSeekToTime) {
            await playerService.seek(state.currentTime);
            seekFinished = true;
          }
        }
      }
    },
    groupedWithPrev: groupWithPrev,
    groupedWithNext: groupWithNext,
    children: reactionChildren,
    replyInfo: replyInfo,
    sendingStatus: isMyMessage(message, currentUser?.userId) ? (
      <GroupChannelMessageOutgoingStatus channel={channel} message={message} />
    ) : null,
    parentMessage: shouldRenderParentMessage(message, hideParentMessage) ? (
      <GroupChannelMessageParentMessage
        channel={channel}
        message={message.parentMessage}
        variant={variant}
        childMessage={message}
        onPress={onPressParentMessage}
      />
    ) : null,
    strings: {
      edited: STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_EDITED_POSTFIX,
      senderName: ('sender' in message && message.sender.nickname) || STRINGS.LABELS.USER_NO_NAME,
      sentDate: STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_TIME(message),
      fileName: message.isFileMessage() ? STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_FILE_TITLE(message) : '',
      unknownTitle: STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_TITLE(message),
      unknownDescription: STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_DESC(message),
    },
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
          const user = message.mentionedUsers?.find((it) => it.userId === groups[2]);
          if (user) {
            const mentionColor =
              !isMyMessage(message, currentUser?.userId) && user.userId === currentUser?.userId
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

  const renderMessage = () => {
    switch (getMessageType(message)) {
      case 'admin': {
        return <GroupChannelMessage.Admin message={message as SendbirdAdminMessage} {...messageProps} />;
      }
      case 'user':
      case 'user.opengraph': {
        if (message.ogMetaData && sbOptions.uikitWithAppInfo.groupChannel.channel.enableOgtag) {
          return (
            <GroupChannelMessage.OpenGraphUser
              message={message as SendbirdUserMessage}
              {...userMessageProps}
              {...messageProps}
            />
          );
        } else {
          return (
            <GroupChannelMessage.User
              message={message as SendbirdUserMessage}
              {...userMessageProps}
              {...messageProps}
            />
          );
        }
      }
      case 'file':
      case 'file.audio': {
        return <GroupChannelMessage.File message={message as SendbirdFileMessage} {...messageProps} />;
      }
      case 'file.image': {
        return <GroupChannelMessage.ImageFile message={message as SendbirdFileMessage} {...messageProps} />;
      }
      case 'file.video': {
        return (
          <GroupChannelMessage.VideoFile
            message={message as SendbirdFileMessage}
            fetchThumbnailFromVideoSource={(uri) => mediaService.getVideoThumbnail({ url: uri, timeMills: 1000 })}
            {...messageProps}
          />
        );
      }
      case 'file.voice': {
        return (
          <GroupChannelMessage.VoiceFile
            message={message as SendbirdFileMessage}
            durationMetaArrayKey={VOICE_MESSAGE_META_ARRAY_DURATION_KEY}
            initialCurrentTime={voiceMessageStatusManager.getCurrentTime(message.channelUrl, message.messageId)}
            onSubscribeStatus={voiceMessageStatusManager.subscribe}
            onUnsubscribeStatus={voiceMessageStatusManager.unsubscribe}
            onUnmount={() => {
              if (isVoiceMessage(message) && playerService.uri === message.url) {
                resetPlayer();
              }
            }}
            {...messageProps}
          />
        );
      }
      case 'unknown':
      default: {
        return <GroupChannelMessage.Unknown message={message} {...messageProps} />;
      }
    }
  };

  const messageGap = useIIFE(() => {
    if (message.isAdminMessage()) {
      if (nextMessage?.isAdminMessage()) {
        return 8;
      } else {
        return 16;
      }
    } else if (nextMessage && shouldRenderParentMessage(nextMessage, hideParentMessage)) {
      return 16;
    } else if (groupWithNext) {
      return 2;
    } else {
      return 16;
    }
  });

  return (
    <Box paddingHorizontal={16} marginBottom={messageGap}>
      <GroupChannelMessageDateSeparator message={message} prevMessage={prevMessage} />
      <GroupChannelMessageFocusAnimation focused={focused}>{renderMessage()}</GroupChannelMessageFocusAnimation>
    </Box>
  );
};

export const GroupChannelTypingIndicatorBubble = () => {
  const { sbOptions } = useSendbirdChat();
  const { publish } = useContext(GroupChannelContexts.PubSub);
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator);

  const shouldRenderBubble = useIIFE(() => {
    if (typingUsers.length === 0) return false;
    if (!sbOptions.uikit.groupChannel.channel.enableTypingIndicator) return false;
    if (!sbOptions.uikit.groupChannel.channel.typingIndicatorTypes.has(TypingIndicatorType.Bubble)) return false;
    return true;
  });

  useEffect(() => {
    if (shouldRenderBubble) publish({ type: 'TYPING_BUBBLE_RENDERED' });
  }, [shouldRenderBubble]);

  if (!shouldRenderBubble) return null;
  return (
    <Box paddingHorizontal={16} marginTop={4} marginBottom={16}>
      <TypingIndicatorBubble typingUsers={typingUsers} />
    </Box>
  );
};

export default React.memo(GroupChannelMessageRenderer);
