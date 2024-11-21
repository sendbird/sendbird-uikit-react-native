import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import {
  Icon,
  ImageWithPlaceholder,
  Text,
  VideoThumbnail,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {
  FileIcon,
  SendbirdBaseMessage,
  SendbirdFileMessage,
  SendbirdUserMessage,
  getFileIconFromMessageType,
  getMessageType,
  getThumbnailUriFromFileMessage,
} from '@sendbird/uikit-utils';

import { useLocalization, usePlatformService } from '../../hooks/useContext';

export type MessageToReplyPreviewProps = {
  messageToReply?: SendbirdFileMessage | SendbirdUserMessage;
  setMessageToReply?: (message?: undefined | SendbirdFileMessage | SendbirdUserMessage) => void;
};

export const MessageToReplyPreview = ({ messageToReply, setMessageToReply }: MessageToReplyPreviewProps) => {
  const { colors, select, palette } = useUIKitTheme();
  const { mediaService } = usePlatformService();
  const { STRINGS } = useLocalization();

  const getFileIconAsImage = (url: string) => {
    return <ImageWithPlaceholder source={{ uri: url }} style={styles.filePreview} />;
  };

  const getFileIconAsVideoThumbnail = (url: string) => {
    return (
      <VideoThumbnail
        style={styles.filePreview}
        iconSize={0}
        source={url}
        fetchThumbnailFromVideoSource={(uri) => mediaService.getVideoThumbnail({ url: uri, timeMills: 1000 })}
      />
    );
  };

  const getFileIconAsSymbol = (icon: FileIcon) => {
    return (
      <Icon
        icon={icon}
        size={20}
        color={colors.onBackground02}
        containerStyle={[
          styles.filePreview,
          { backgroundColor: select({ light: palette.background100, dark: palette.background500 }) },
        ]}
      />
    );
  };

  const getFileIcon = (messageToReply: SendbirdBaseMessage) => {
    if (messageToReply?.isFileMessage()) {
      const messageType = getMessageType(messageToReply);
      switch (messageType) {
        case 'file.image':
          return getFileIconAsImage(getThumbnailUriFromFileMessage(messageToReply));
        case 'file.video':
          return getFileIconAsVideoThumbnail(getThumbnailUriFromFileMessage(messageToReply));
        case 'file.voice':
          return null;
        default:
          return getFileIconAsSymbol(getFileIconFromMessageType(messageType));
      }
    }
    return null;
  };

  if (!messageToReply) return null;

  return (
    <View style={[styles.messageToReplyContainer, { borderColor: colors.onBackground04 }]}>
      <View style={styles.infoContainer}>
        {getFileIcon(messageToReply)}
        <View style={styles.infoText}>
          <Text caption1 numberOfLines={1}>
            {STRINGS.LABELS.CHANNEL_INPUT_REPLY_PREVIEW_TITLE(messageToReply.sender)}
          </Text>
          <Text caption2 numberOfLines={1} color={colors.onBackground03}>
            {STRINGS.LABELS.CHANNEL_INPUT_REPLY_PREVIEW_BODY(messageToReply)}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setMessageToReply?.(undefined)} style={{ marginStart: 16 }}>
        <Icon icon={'close'} size={24} color={colors.onBackground01} />
      </TouchableOpacity>
    </View>
  );
};

const styles = createStyleSheet({
  messageToReplyContainer: {
    flexDirection: 'row',
    paddingStart: 18,
    paddingEnd: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    height: 32,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  filePreview: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginEnd: 10,
    overflow: 'hidden',
  },
});
