import React, { useEffect, useState } from 'react';
import type Sendbird from 'sendbird';

import { useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Icon, LoadingSpinner, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { useUniqId } from '@sendbird/uikit-utils';

const SIZE = 16;

type Props = { channel: Sendbird.GroupChannel; message: SendbirdMessage };
const MessageOutgoingStatus: React.FC<Props> = ({ channel, message }) => {
  if (!message.isUserMessage() && !message.isFileMessage()) return null;

  const handlerId = useUniqId('MessageOutgoingStatus');

  const { sdk } = useSendbirdChat();
  const { colors } = useUIKitTheme();

  const [state, setState] = useState(() => ({
    unreadCount: channel.getUnreadMemberCount(message),
    undeliveredCount: channel.getUndeliveredMemberCount(message),
  }));

  const getCounts = (channel: Sendbird.GroupChannel, message: Sendbird.UserMessage | Sendbird.FileMessage) => {
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
      handler.onDeliveryReceiptUpdated = (channel) => {
        if (channel.url === message.channelUrl && channel.isGroupChannel()) setState(getCounts(channel, message));
      };
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

  if (state.undeliveredCount === 0) {
    return <Icon icon={'done-all'} size={SIZE} color={colors.onBackground03} style={styles.container} />;
  }

  return <Icon icon={'done'} size={SIZE} color={colors.onBackground03} style={styles.container} />;
};

const styles = createStyleSheet({
  container: {
    marginRight: 4,
  },
});

export default React.memo(MessageOutgoingStatus);
