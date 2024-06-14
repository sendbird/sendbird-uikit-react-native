import React, { useContext, useEffect, useState } from 'react';

import {
  Box,
  Icon,
  ImageWithPlaceholder,
  PressBox,
  Text,
  VideoThumbnail,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdUserMessage,
  getFileIconFromMessageType,
  getMessageType,
  getThumbnailUriFromFileMessage,
  truncate,
  useIIFE,
} from '@sendbird/uikit-utils';

import { GroupChannelContexts } from '../../domain/groupChannel/module/moduleContext';
import { useLocalization, usePlatformService, useSendbirdChat } from '../../hooks/useContext';

type Props = {
  variant: 'outgoing' | 'incoming';
  channel: SendbirdGroupChannel;
  message: SendbirdUserMessage | SendbirdFileMessage;
  childMessage: SendbirdUserMessage | SendbirdFileMessage;
  onPress?: (parentMessage: SendbirdMessage, childMessage: SendbirdUserMessage | SendbirdFileMessage) => void;
};

const GroupChannelMessageParentMessage = ({ variant, channel, message, childMessage, onPress }: Props) => {
  const { currentUser } = useSendbirdChat();
  const groupChannelPubSub = useContext(GroupChannelContexts.PubSub);
  const { select, colors, palette } = useUIKitTheme();
  const { STRINGS } = useLocalization();
  const { mediaService } = usePlatformService();

  const [parentMessage, setParentMessage] = useState(() => message);
  const type = getMessageType(parentMessage);

  useEffect(() => {
    return groupChannelPubSub.subscribe(({ type, data }) => {
      if (type === 'MESSAGES_UPDATED') {
        const updatedParent = data.messages.find((it): it is SendbirdUserMessage | SendbirdFileMessage => {
          return it.messageId === parentMessage.messageId;
        });
        if (updatedParent) setParentMessage(updatedParent);
      }
    });
  }, []);

  const renderMessageWithText = (message: string) => {
    return (
      <Box
        style={styles.bubbleContainer}
        backgroundColor={select({ light: palette.background100, dark: palette.background400 })}
      >
        <Text body3 color={colors.onBackground03} suppressHighlighting numberOfLines={2} ellipsizeMode={'tail'}>
          {message}
        </Text>
      </Box>
    );
  };

  const renderFileMessageAsVideoThumbnail = (url: string) => {
    return (
      <VideoThumbnail
        style={styles.image}
        iconSize={18}
        source={url}
        fetchThumbnailFromVideoSource={(uri) => mediaService.getVideoThumbnail({ url: uri, timeMills: 1000 })}
      />
    );
  };
  const renderFileMessageAsPreview = (url: string) => {
    return <ImageWithPlaceholder style={styles.image} source={{ uri: url }} />;
  };
  const renderFileMessageAsDownloadable = (name: string) => {
    return (
      <Box
        style={styles.bubbleContainer}
        backgroundColor={select({ light: palette.background100, dark: palette.background400 })}
      >
        <Icon
          icon={getFileIconFromMessageType(type)}
          size={16}
          color={colors.onBackground03}
          containerStyle={styles.fileIcon}
        />
        <Text body3 color={colors.onBackground03} numberOfLines={1} ellipsizeMode={'middle'}>
          {truncate(name, { mode: 'mid', maxLen: 20 })}
        </Text>
      </Box>
    );
  };

  const parentMessageComponent = useIIFE(() => {
    if (channel.messageOffsetTimestamp > parentMessage.createdAt) {
      return renderMessageWithText(STRINGS.LABELS.MESSAGE_UNAVAILABLE);
    }

    switch (type) {
      case 'user':
      case 'user.opengraph': {
        return renderMessageWithText((parentMessage as SendbirdUserMessage).message);
      }
      case 'file':
      case 'file.audio': {
        return renderFileMessageAsDownloadable((parentMessage as SendbirdFileMessage).name);
      }
      case 'file.video': {
        return renderFileMessageAsVideoThumbnail(getThumbnailUriFromFileMessage(parentMessage as SendbirdFileMessage));
      }
      case 'file.image': {
        return renderFileMessageAsPreview(getThumbnailUriFromFileMessage(parentMessage as SendbirdFileMessage));
      }
      case 'file.voice': {
        return renderMessageWithText(STRINGS.LABELS.VOICE_MESSAGE);
      }
      default: {
        return null;
      }
    }
  });

  return (
    <Box>
      <Box
        alignItems={variant === 'outgoing' ? 'flex-end' : 'flex-start'}
        paddingLeft={variant === 'outgoing' ? 0 : 12}
        paddingRight={variant === 'outgoing' ? 12 : 0}
      >
        <PressBox onPress={() => onPress?.(parentMessage, childMessage)} style={styles.senderLabel}>
          <Icon icon={'reply-filled'} size={13} color={colors.onBackground03} containerStyle={{ marginRight: 4 }} />
          <Text caption1 color={colors.onBackground03}>
            {STRINGS.LABELS.REPLY_FROM_SENDER_TO_RECEIVER(childMessage, parentMessage, currentUser?.userId)}
          </Text>
        </PressBox>
      </Box>
      <Box
        flexDirection={'row'}
        justifyContent={variant === 'outgoing' ? 'flex-end' : 'flex-start'}
        style={styles.messageContainer}
      >
        <PressBox onPress={() => onPress?.(parentMessage, childMessage)}>{parentMessageComponent}</PressBox>
      </Box>
    </Box>
  );
};

const styles = createStyleSheet({
  messageContainer: {
    opacity: 0.5,
    marginTop: 4,
    marginBottom: -6,
  },
  bubbleContainer: {
    maxWidth: 220,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 6,
  },
  image: {
    width: 156,
    height: 104,
    borderRadius: 16,
    overflow: 'hidden',
  },
  fileIcon: {
    width: 16,
    height: 16,
    borderRadius: 10,
    marginRight: 4,
    marginTop: 2,
  },
  senderLabel: {
    flexDirection: 'row',
  },
});

export default GroupChannelMessageParentMessage;
