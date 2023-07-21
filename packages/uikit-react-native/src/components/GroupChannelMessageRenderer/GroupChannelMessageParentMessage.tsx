import React, { useContext, useEffect, useState } from 'react';

import {
  Box,
  Icon,
  ImageWithPlaceholder,
  PressBox,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {
  SendbirdFileMessage,
  SendbirdMessage,
  SendbirdUserMessage,
  getFileIconFromMessageType,
  getMessageType,
  useIIFE,
} from '@sendbird/uikit-utils';

import { GroupChannelContexts } from '../../domain/groupChannel/module/moduleContext';
import { useLocalization } from '../../hooks/useContext';

type Props = {
  variant: 'outgoing' | 'incoming';
  message: SendbirdUserMessage | SendbirdFileMessage;
  childMessage: SendbirdUserMessage | SendbirdFileMessage;
  onPress?: (message: SendbirdMessage) => void;
};

const GroupChannelMessageParentMessage = ({ variant, message, childMessage, onPress }: Props) => {
  const groupChannelPubSub = useContext(GroupChannelContexts.PubSub);
  const { select, colors, palette } = useUIKitTheme();
  const { STRINGS } = useLocalization();

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

  const parentMessageComponent = useIIFE(() => {
    switch (type) {
      case 'user':
      case 'user.opengraph': {
        return (
          <Box
            style={styles.bubbleContainer}
            backgroundColor={select({ light: palette.background100, dark: palette.background400 })}
          >
            <Text body3 color={colors.onBackground03} suppressHighlighting numberOfLines={2} ellipsizeMode={'tail'}>
              {(parentMessage as SendbirdUserMessage).message}
            </Text>
          </Box>
        );
      }
      case 'file':
      case 'file.video': // TODO: video thumbnail preview
      case 'file.audio': {
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
              {(parentMessage as SendbirdFileMessage).name}
            </Text>
          </Box>
        );
      }
      case 'file.image': {
        return (
          <ImageWithPlaceholder style={styles.image} source={{ uri: (parentMessage as SendbirdFileMessage).url }} />
        );
      }
      default: {
        return null;
      }
    }
  });

  return (
    <PressBox onPress={() => onPress?.(parentMessage)}>
      <Box
        flex={1}
        flexDirection={'row'}
        justifyContent={variant === 'outgoing' ? 'flex-end' : 'flex-start'}
        paddingLeft={variant === 'outgoing' ? 0 : 12}
        paddingRight={variant === 'outgoing' ? 12 : 0}
      >
        <Icon icon={'reply-filled'} size={13} color={colors.onBackground03} containerStyle={{ marginRight: 4 }} />
        <Text caption1 color={colors.onBackground03}>
          {STRINGS.LABELS.REPLY_FROM_SENDER_TO_RECEIVER(childMessage.sender, parentMessage.sender)}
        </Text>
      </Box>
      <Box
        flexDirection={'row'}
        justifyContent={variant === 'outgoing' ? 'flex-end' : 'flex-start'}
        style={styles.messageContainer}
      >
        {parentMessageComponent}
      </Box>
    </PressBox>
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
  },
  fileIcon: {
    width: 16,
    height: 16,
    borderRadius: 10,
    marginRight: 4,
    marginTop: 2,
  },
});

export default GroupChannelMessageParentMessage;
