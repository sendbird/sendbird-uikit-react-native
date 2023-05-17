import React from 'react';

import type { GroupChannelMessageProps } from '@sendbird/uikit-react-native-foundation';
import { Box, GroupChannelMessage } from '@sendbird/uikit-react-native-foundation';
import {
  SendbirdAdminMessage,
  SendbirdFileMessage,
  SendbirdMessage,
  SendbirdUserMessage,
  calcMessageGrouping,
  getMessageType,
} from '@sendbird/uikit-utils';

import type { GroupChannelProps } from '../../domain/groupChannel/types';
import { useLocalization, usePlatformService, useSendbirdChat } from '../../hooks/useContext';
import SBUUtils from '../../libs/SBUUtils';
import GroupChannelMessageDateSeparator from './GroupChannelMessageDateSeparator';

const GroupChannelMessageRenderer: GroupChannelProps['Fragment']['renderMessage'] = ({
  channel,
  message,
  onPress,
  onLongPress,
  onPressAvatar,
  enableMessageGrouping,
  prevMessage,
  nextMessage,
}) => {
  const { features } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { mediaService } = usePlatformService();
  const { groupWithPrev } = calcMessageGrouping(Boolean(enableMessageGrouping), message, prevMessage, nextMessage);

  const messageProps: Omit<GroupChannelMessageProps<SendbirdMessage>, 'message'> = {
    channel,
    onPress,
    onLongPress,
    onPressURL: () => message.ogMetaData?.url && SBUUtils.openURL(message.ogMetaData?.url),
    onPressAvatar: () => 'sender' in message && onPressAvatar?.(message.sender, { hideMessageButton: true }),
    grouped: groupWithPrev,
    strings: {
      edited: STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_EDITED_POSTFIX,
      senderName: ('sender' in message && message.sender.nickname) || STRINGS.LABELS.USER_NO_NAME,
      sentDate: STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_TIME(message),
      fileName: message.isFileMessage() ? STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_FILE_TITLE(message) : '',
      unknownTitle: STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_TITLE(message),
      unknownDescription: STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_DESC(message),
    },
  };
  const renderMessage = () => {
    switch (getMessageType(message)) {
      case 'admin': {
        return <GroupChannelMessage.Admin message={message as SendbirdAdminMessage} {...messageProps} />;
      }
      case 'user': {
        return <GroupChannelMessage.User message={message as SendbirdUserMessage} {...messageProps} />;
      }
      case 'user.opengraph': {
        if (features.groupChannelOGTagEnabled) {
          return <GroupChannelMessage.OpenGraphUser message={message as SendbirdUserMessage} {...messageProps} />;
        } else {
          return <GroupChannelMessage.User message={message as SendbirdUserMessage} {...messageProps} />;
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
      case 'unknown':
      default: {
        return <GroupChannelMessage.Unknown message={message} {...messageProps} />;
      }
    }
  };

  return (
    <Box>
      <GroupChannelMessageDateSeparator message={message} prevMessage={prevMessage} />
      {renderMessage()}
    </Box>
  );
};

export default React.memo(GroupChannelMessageRenderer);
