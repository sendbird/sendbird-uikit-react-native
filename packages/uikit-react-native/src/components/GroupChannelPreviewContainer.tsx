import React, { useState } from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import {
  GroupChannelPreview,
  LoadingSpinner,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import Icon from '@sendbird/uikit-react-native-foundation/src/ui/Icon';
import {
  SendbirdGroupChannel,
  SendbirdUser,
  getFileExtension,
  getFileType,
  isDifferentChannel,
  isMyMessage,
  useForceUpdate,
  useIIFE,
  useUniqId,
} from '@sendbird/uikit-utils';

import { useLocalization, useSendbirdChat } from '../hooks/useContext';
import ChannelCover from './ChannelCover';
import SBUPressable from './SBUPressable';

const iconMapper = { audio: 'file-audio', image: 'photo', video: 'play', file: 'file-document' } as const;

type Props = {
  channel: SendbirdGroupChannel;
  onPress: () => void;
  onLongPress: () => void;
};
const GroupChannelPreviewContainer = ({ onPress, onLongPress, channel }: Props) => {
  const { currentUser, sdk, features } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  const [typingUsers, setTypingUsers] = useState<SendbirdUser[]>([]);
  const forceUpdate = useForceUpdate();

  if (features.channelListTypingIndicatorEnabled) {
    const id = useUniqId('GroupChannelPreviewContainer');
    useChannelHandler(sdk, `GroupChannelPreviewContainer_TypingIndicator_${id}`, {
      onTypingStatusUpdated(eventChannel) {
        if (isDifferentChannel(channel, eventChannel)) return;
        setTypingUsers(eventChannel.getTypingUsers());
      },
    });
  }

  if (features.channelListMessageReceiptStatusEnabled) {
    const id = useUniqId('GroupChannelPreviewContainer');
    useChannelHandler(sdk, `GroupChannelPreviewContainer_ReceiptStatus_${id}`, {
      onDeliveryReceiptUpdated(eventChannel) {
        if (isDifferentChannel(channel, eventChannel)) return;
        if (!eventChannel.isGroupChannel() || !eventChannel.lastMessage) return;
        if (!isMyMessage(eventChannel.lastMessage, currentUser?.userId)) return;

        forceUpdate();
      },
      onReadReceiptUpdated(eventChannel) {
        if (isDifferentChannel(channel, eventChannel)) return;
        if (!eventChannel.isGroupChannel() || !eventChannel.lastMessage) return;
        if (!isMyMessage(eventChannel.lastMessage, currentUser?.userId)) return;

        forceUpdate();
      },
    });
  }

  const bodyText = useIIFE(() => {
    if (typingUsers.length > 0) return STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers) || '';
    else return STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_BODY(channel);
  });

  const bodyIcon = useIIFE(() => {
    if (!channel.lastMessage?.isFileMessage()) return undefined;
    return iconMapper[getFileType(channel.lastMessage.type || getFileExtension(channel.lastMessage.name))];
  });

  const titleCaptionIcon = useIIFE(() => {
    if (!channel.lastMessage) return undefined;
    if (!features.channelListMessageReceiptStatusEnabled) return undefined;
    if (!isMyMessage(channel.lastMessage, currentUser?.userId)) return undefined;

    if (channel.lastMessage.sendingStatus === 'pending') {
      return <LoadingSpinner size={16} style={styles.titleCaptionIcon} />;
    }

    if (channel.lastMessage.sendingStatus === 'failed') {
      return <Icon icon={'error'} size={16} color={colors.error} style={styles.titleCaptionIcon} />;
    }

    if (channel.getUnreadMemberCount(channel.lastMessage) === 0) {
      return <Icon icon={'done-all'} size={16} color={colors.secondary} style={styles.titleCaptionIcon} />;
    }

    if (features.deliveryReceiptEnabled) {
      if (channel.getUndeliveredMemberCount(channel.lastMessage) === 0) {
        return <Icon icon={'done-all'} size={16} color={colors.onBackground03} style={styles.titleCaptionIcon} />;
      }
      return <Icon icon={'done'} size={16} color={colors.onBackground03} containerStyle={styles.titleCaptionIcon} />;
    }

    return <Icon icon={'done-all'} size={16} color={colors.onBackground03} style={styles.titleCaptionIcon} />;
  });

  return (
    <SBUPressable onPress={onPress} onLongPress={onLongPress}>
      <GroupChannelPreview
        customCover={<ChannelCover channel={channel} size={56} />}
        coverUrl={channel.coverUrl}
        title={STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_TITLE(currentUser?.userId ?? '', channel)}
        titleCaptionLeft={titleCaptionIcon}
        titleCaption={STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_TITLE_CAPTION(channel)}
        body={bodyText}
        bodyIcon={bodyIcon}
        badgeCount={channel.unreadMessageCount}
        memberCount={channel.memberCount > 2 ? channel.memberCount : undefined}
        frozen={channel.isFrozen}
        notificationOff={channel.myPushTriggerOption === 'off'}
      />
    </SBUPressable>
  );
};

const styles = createStyleSheet({
  titleCaptionIcon: {
    marginRight: 4,
  },
});

export default GroupChannelPreviewContainer;
