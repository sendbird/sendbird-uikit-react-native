import React, { useEffect } from 'react';

import { Icon, LoadingSpinner, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel, SendbirdMessage } from '@sendbird/uikit-utils';
import { isDifferentChannel, useForceUpdate, useUniqId } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../../hooks/useContext';

const SIZE = 16;

type Props = { channel: SendbirdGroupChannel; message: SendbirdMessage };
const MessageOutgoingStatus = ({ channel, message }: Props) => {
  if (!message.isUserMessage() && !message.isFileMessage()) return null;

  const { sdk, features } = useSendbirdChat();
  const { colors } = useUIKitTheme();

  const uniqId = useUniqId('MessageOutgoingStatus');
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const handlerId = `MessageOutgoingStatus_${uniqId}`;

    if (
      message.sendingStatus === 'succeeded' &&
      channel.getUnreadMemberCount(message) === 0 &&
      channel.getUndeliveredMemberCount(message) === 0
    ) {
      sdk.removeChannelHandler(handlerId);
    } else {
      const handler = new sdk.ChannelHandler();

      handler.onReadReceiptUpdated = (eventChannel) => {
        if (isDifferentChannel(channel, eventChannel)) return;
        forceUpdate();
      };

      if (features.deliveryReceiptEnabled) {
        handler.onDeliveryReceiptUpdated = (eventChannel) => {
          if (isDifferentChannel(channel, eventChannel)) return;
          forceUpdate();
        };
      }

      sdk.addChannelHandler(handlerId, handler);
    }

    return () => {
      sdk.removeChannelHandler(handlerId);
    };
  }, [message.sendingStatus]);

  if (message.sendingStatus === 'pending') {
    return <LoadingSpinner size={SIZE} style={styles.container} />;
  }

  if (message.sendingStatus === 'failed') {
    return <Icon icon={'error'} size={SIZE} color={colors.error} style={styles.container} />;
  }

  if (channel.getUnreadMemberCount(message) === 0) {
    return <Icon icon={'done-all'} size={SIZE} color={colors.secondary} style={styles.container} />;
  }

  if (features.deliveryReceiptEnabled) {
    if (channel.getUndeliveredMemberCount(message) === 0) {
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
