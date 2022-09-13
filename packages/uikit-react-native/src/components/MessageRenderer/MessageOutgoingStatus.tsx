import React from 'react';

import { useMessageOutgoingStatus } from '@sendbird/uikit-chat-hooks';
import { Icon, LoadingSpinner, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel, SendbirdMessage } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../../hooks/useContext';

const SIZE = 16;

type Props = { channel: SendbirdGroupChannel; message: SendbirdMessage };
const MessageOutgoingStatus = ({ channel, message }: Props) => {
  if (!message.isUserMessage() && !message.isFileMessage()) return null;

  const { sdk } = useSendbirdChat();
  const { colors } = useUIKitTheme();
  const outgoingStatus = useMessageOutgoingStatus(sdk, channel, message);

  if (outgoingStatus === 'PENDING') {
    return <LoadingSpinner size={SIZE} style={styles.container} />;
  }

  if (outgoingStatus === 'FAILED') {
    return <Icon icon={'error'} size={SIZE} color={colors.error} style={styles.container} />;
  }

  if (outgoingStatus === 'READ') {
    return <Icon icon={'done-all'} size={SIZE} color={colors.secondary} style={styles.container} />;
  }

  if (outgoingStatus === 'UNREAD' || outgoingStatus === 'DELIVERED') {
    return <Icon icon={'done-all'} size={SIZE} color={colors.onBackground03} style={styles.container} />;
  }

  if (outgoingStatus === 'UNDELIVERED') {
    return <Icon icon={'done'} size={SIZE} color={colors.onBackground03} style={styles.container} />;
  }

  return null;
};

const styles = createStyleSheet({
  container: {
    marginRight: 4,
  },
});

export default React.memo(MessageOutgoingStatus);
