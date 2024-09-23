import React from 'react';

import type { OpenChannelMessageProps } from '@sendbird/uikit-react-native-foundation';
import { Box, OpenChannelMessage } from '@sendbird/uikit-react-native-foundation';
import {
  SendbirdAdminMessage,
  SendbirdFileMessage,
  SendbirdMessage,
  SendbirdUserMessage,
  calcMessageGrouping,
  getMessageType,
} from '@sendbird/uikit-utils';

import type { OpenChannelProps } from '../../domain/openChannel/types';
import { useLocalization, usePlatformService, useSBUHandlers, useSendbirdChat } from '../../hooks/useContext';
import OpenChannelMessageDateSeparator from './OpenChannelMessageDateSeparator';

const OpenChannelMessageRenderer: OpenChannelProps['Fragment']['renderMessage'] = ({
  channel,
  message,
  onPress,
  onLongPress,
  onShowUserProfile,
  enableMessageGrouping,
  prevMessage,
  nextMessage,
}) => {
  const handlers = useSBUHandlers();
  const { sbOptions } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { mediaService } = usePlatformService();
  const { groupWithPrev } = calcMessageGrouping(Boolean(enableMessageGrouping), message, prevMessage, nextMessage);

  const messageProps: Omit<OpenChannelMessageProps<SendbirdMessage>, 'message'> = {
    channel,
    onPress,
    onLongPress,
    onPressURL: (url) => handlers.onOpenURL(url),
    onPressAvatar: () => 'sender' in message && onShowUserProfile?.(message.sender, { hideMessageButton: true }),
    grouped: groupWithPrev,
    strings: {
      edited: STRINGS.OPEN_CHANNEL.MESSAGE_BUBBLE_EDITED_POSTFIX,
      senderName: ('sender' in message && message.sender.nickname) || STRINGS.LABELS.USER_NO_NAME,
      sentDate: STRINGS.OPEN_CHANNEL.MESSAGE_BUBBLE_TIME(message),
      fileName: message.isFileMessage() ? STRINGS.OPEN_CHANNEL.MESSAGE_BUBBLE_FILE_TITLE(message) : '',
      unknownTitle: STRINGS.OPEN_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_TITLE(message),
      unknownDescription: STRINGS.OPEN_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_DESC(message),
    },
  };
  const renderMessage = () => {
    switch (getMessageType(message)) {
      case 'admin': {
        return <OpenChannelMessage.Admin message={message as SendbirdAdminMessage} {...messageProps} />;
      }
      case 'user': {
        return <OpenChannelMessage.User message={message as SendbirdUserMessage} {...messageProps} />;
      }
      case 'user.opengraph': {
        if (sbOptions.uikitWithAppInfo.openChannel.channel.enableOgtag) {
          return <OpenChannelMessage.OpenGraphUser message={message as SendbirdUserMessage} {...messageProps} />;
        } else {
          return <OpenChannelMessage.User message={message as SendbirdUserMessage} {...messageProps} />;
        }
      }
      case 'file':
      case 'file.voice':
      case 'file.audio': {
        return <OpenChannelMessage.File message={message as SendbirdFileMessage} {...messageProps} />;
      }
      case 'file.image': {
        return <OpenChannelMessage.ImageFile message={message as SendbirdFileMessage} {...messageProps} />;
      }
      case 'file.video': {
        return (
          <OpenChannelMessage.VideoFile
            message={message as SendbirdFileMessage}
            fetchThumbnailFromVideoSource={(uri) => mediaService.getVideoThumbnail({ url: uri, timeMills: 1000 })}
            {...messageProps}
          />
        );
      }
      case 'unknown':
      default: {
        return <OpenChannelMessage.Unknown message={message} {...messageProps} />;
      }
    }
  };

  return (
    <Box>
      <OpenChannelMessageDateSeparator message={message} prevMessage={prevMessage} />
      {renderMessage()}
    </Box>
  );
};

export default React.memo(OpenChannelMessageRenderer);
