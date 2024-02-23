import React from 'react';
import type { ImageStyle, StyleProp } from 'react-native';

import { useMessageOutgoingStatus } from '@sendbird/uikit-chat-hooks';
import { Icon, LoadingSpinner, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel, SendbirdMessage } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../../hooks/useContext';

const SIZE = 16;

type Props = {
  channel: SendbirdGroupChannel;
  message: SendbirdMessage;
  style?: StyleProp<ImageStyle>;
};
const GroupChannelMessageOutgoingStatus = ({ channel, message, style }: Props) => {
  const { sdk } = useSendbirdChat();
  const { colors } = useUIKitTheme();
  const outgoingStatus = useMessageOutgoingStatus(sdk, channel, message);

  if (!message.isUserMessage() && !message.isFileMessage()) return null;
  if (channel.isEphemeral) return null;

  if (outgoingStatus === 'PENDING') {
    return <LoadingSpinner size={SIZE} style={style} />;
  }

  if (outgoingStatus === 'FAILED') {
    return <Icon icon={'error'} size={SIZE} color={colors.error} style={style} />;
  }

  if (outgoingStatus === 'READ') {
    return <Icon icon={'done-all'} size={SIZE} color={colors.secondary} style={style} />;
  }

  if (outgoingStatus === 'UNREAD' || outgoingStatus === 'DELIVERED') {
    return <Icon icon={'done-all'} size={SIZE} color={colors.onBackground03} style={style} />;
  }

  if (outgoingStatus === 'UNDELIVERED') {
    return <Icon icon={'done'} size={SIZE} color={colors.onBackground03} style={style} />;
  }

  return null;
};

export default React.memo(GroupChannelMessageOutgoingStatus);
