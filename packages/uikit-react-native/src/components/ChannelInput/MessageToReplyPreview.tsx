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
    return <ImageWithPlaceholder source={{ uri: url }} style={styles.previewImage} />;
  };

  const getFileIconAsVideoThumbnail = (url: string) => {
    return (
      <VideoThumbnail
        style={styles.previewImage}
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
          styles.fileIcon,
          {
            backgroundColor: select({ light: palette.background100, dark: palette.background500 }),
          },
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
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {getFileIcon(messageToReply)}
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '900', marginBottom: 4 }}>
            {STRINGS.LABELS.CHANNEL_INPUT_REPLY_PREVIEW_TITLE(messageToReply.sender)}
          </Text>
          <Text numberOfLines={1} style={{ fontSize: 13, color: colors.onBackground03 }}>
            {STRINGS.LABELS.CHANNEL_INPUT_REPLY_PREVIEW_BODY(messageToReply)}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setMessageToReply?.(undefined)}>
        <Icon icon={'close'} size={24} color={colors.onBackground01} containerStyle={styles.closeIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = createStyleSheet({
  previewImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginTop: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  messageToReplyContainer: {
    flexDirection: 'row',
    paddingLeft: 18,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 2,
  },
  closeIcon: {
    marginLeft: 4,
    padding: 4,
  },
});
