import React, { useEffect, useState } from 'react';

import { Icon, LoadingSpinner, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type {
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';
import { useUniqId } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../../hooks/useContext';

const SIZE = 16;

type Props = { channel: SendbirdGroupChannel; message: SendbirdMessage };
const MessageOutgoingStatus = ({ channel, message }: Props) => {
  if (!message.isUserMessage() && !message.isFileMessage()) return null;

  const handlerId = useUniqId('MessageOutgoingStatus');

  const { sdk, features } = useSendbirdChat();
  const { colors } = useUIKitTheme();

  const [state, setState] = useState(() => ({
    unreadCount: channel.getUnreadMemberCount(message),
    undeliveredCount: channel.getUndeliveredMemberCount(message),
  }));

  const getCounts = (channel: SendbirdGroupChannel, message: SendbirdUserMessage | SendbirdFileMessage) => {
    return {
      unreadCount: channel.getUnreadMemberCount(message),
      undeliveredCount: channel.getUndeliveredMemberCount(message),
    };
  };

  useEffect(() => {
    const id = String(handlerId);
    if (message.sendingStatus === 'succeeded' && state.unreadCount === 0 && state.undeliveredCount === 0) {
      sdk.removeChannelHandler(id);
    } else {
      const handler = new sdk.ChannelHandler();
      handler.onReadReceiptUpdated = (channel) => {
        if (channel.url === message.channelUrl) setState(getCounts(channel, message));
      };

      if (features.deliveryReceiptEnabled) {
        handler.onDeliveryReceiptUpdated = (channel) => {
          if (channel.url === message.channelUrl && channel.isGroupChannel()) setState(getCounts(channel, message));
        };
      }
      sdk.addChannelHandler(id, handler);
    }

    return () => {
      sdk.removeChannelHandler(id);
    };
  }, [message.sendingStatus]);

  if (message.sendingStatus === 'pending') {
    return <LoadingSpinner size={SIZE} style={styles.container} />;
  }

  if (message.sendingStatus === 'failed') {
    return <Icon icon={'error'} size={SIZE} color={colors.error} style={styles.container} />;
  }

  if (state.unreadCount === 0) {
    return <Icon icon={'done-all'} size={SIZE} color={colors.secondary} style={styles.container} />;
  }

  if (features.deliveryReceiptEnabled) {
    if (state.undeliveredCount === 0) {
      return <Icon icon={'done-all'} size={SIZE} color={colors.onBackground03} style={styles.container} />;
    }
    return <Icon icon={'done'} size={SIZE} color={colors.onBackground03} style={styles.container} />;
  }

  return <Icon icon={'done-all'} size={SIZE} color={colors.onBackground03} style={styles.container} />;
};

const styles = createStyleSheet({
  container: {
    marginRight: 4,
  },
});

export default React.memo(MessageOutgoingStatus);
