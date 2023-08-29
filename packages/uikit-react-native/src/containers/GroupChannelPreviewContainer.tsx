import React, { useState } from 'react';
import { Pressable } from 'react-native';

import { useChannelHandler, useMessageOutgoingStatus } from '@sendbird/uikit-chat-hooks';
import {
  GroupChannelPreview,
  Icon,
  LoadingSpinner,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {
  SendbirdGroupChannel,
  SendbirdUser,
  convertFileTypeToMessageType,
  getFileIconFromMessageType,
  getFileTypeFromMessage,
  isDifferentChannel,
  isMyMessage,
  isVoiceMessage,
  useIIFE,
  useUniqHandlerId,
} from '@sendbird/uikit-utils';

import ChannelCover from '../components/ChannelCover';
import { DEFAULT_LONG_PRESS_DELAY } from '../constants';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

type Props = {
  channel: SendbirdGroupChannel;
  onPress: () => void;
  onLongPress: () => void;
};
const GroupChannelPreviewContainer = ({ onPress, onLongPress, channel }: Props) => {
  const { currentUser, sdk, sbOptions, mentionManager } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  const [typingUsers, setTypingUsers] = useState<SendbirdUser[]>([]);

  const handlerId = useUniqHandlerId('GroupChannelPreviewContainer_TypingIndicator');
  useChannelHandler(sdk, handlerId, {
    onTypingStatusUpdated(eventChannel) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (!sbOptions.uikit.groupChannel.channelList.enableTypingIndicator) return;
      setTypingUsers(eventChannel.getTypingUsers());
    },
  });

  const outgoingStatus = useMessageOutgoingStatus(sdk, channel, channel.lastMessage);

  const bodyText = useIIFE(() => {
    if (typingUsers.length > 0) return STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers) || '';
    else return STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_BODY(channel);
  });

  const fileType = useIIFE(() => {
    if (!channel.lastMessage?.isFileMessage()) return undefined;
    if (typingUsers.length > 0) return undefined;
    if (isVoiceMessage(channel.lastMessage)) return undefined;
    return getFileTypeFromMessage(channel.lastMessage);
  });

  const titleCaptionIcon = useIIFE(() => {
    if (!channel.lastMessage || channel.isEphemeral) return undefined;
    if (!sbOptions.uikit.groupChannel.channelList.enableMessageReceiptStatus) return undefined;
    if (!isMyMessage(channel.lastMessage, currentUser?.userId)) return undefined;

    if (outgoingStatus === 'PENDING') {
      return <LoadingSpinner size={16} style={styles.titleCaptionIcon} />;
    }

    if (outgoingStatus === 'FAILED') {
      return <Icon icon={'error'} size={16} color={colors.error} style={styles.titleCaptionIcon} />;
    }

    if (outgoingStatus === 'UNDELIVERED') {
      return <Icon icon={'done'} size={16} color={colors.onBackground03} containerStyle={styles.titleCaptionIcon} />;
    }

    if (outgoingStatus === 'DELIVERED' || outgoingStatus === 'UNREAD') {
      return <Icon icon={'done-all'} size={16} color={colors.onBackground03} style={styles.titleCaptionIcon} />;
    }

    if (outgoingStatus === 'READ') {
      return <Icon icon={'done-all'} size={16} color={colors.secondary} style={styles.titleCaptionIcon} />;
    }

    return undefined;
  });

  const unreadMessageCount = useIIFE(() => (channel.isEphemeral ? 0 : channel.unreadMessageCount));

  return (
    <Pressable delayLongPress={DEFAULT_LONG_PRESS_DELAY} onPress={onPress} onLongPress={onLongPress}>
      <GroupChannelPreview
        customCover={<ChannelCover channel={channel} size={56} />}
        coverUrl={channel.coverUrl}
        title={STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_TITLE(currentUser?.userId ?? '', channel)}
        titleCaptionLeft={titleCaptionIcon}
        titleCaption={STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_TITLE_CAPTION(channel)}
        body={bodyText}
        bodyIcon={fileType && getFileIconFromMessageType(convertFileTypeToMessageType(fileType))}
        badgeCount={unreadMessageCount}
        mentioned={channel.unreadMentionCount > 0}
        mentionTrigger={mentionManager.config.trigger}
        memberCount={channel.memberCount > 2 ? channel.memberCount : undefined}
        frozen={channel.isFrozen}
        broadcast={channel.isBroadcast}
        notificationOff={channel.myPushTriggerOption === 'off'}
      />
    </Pressable>
  );
};

const styles = createStyleSheet({
  titleCaptionIcon: {
    marginRight: 4,
  },
  broadcastCover: {
    padding: 12,
    borderRadius: 28,
  },
});

export default GroupChannelPreviewContainer;
