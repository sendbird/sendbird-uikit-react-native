import React, { forwardRef } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';

import { MentionType } from '@sendbird/chat/message';
import type { BottomSheetItem } from '@gathertown/uikit-react-native-foundation';
import {
  Icon,
  ImageWithPlaceholder,
  Text,
  TextInput,
  VideoThumbnail,
  createStyleSheet,
  useAlert,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@gathertown/uikit-react-native-foundation';
import {
  FileIcon,
  Logger,
  SendbirdBaseMessage,
  SendbirdChannel,
  getFileIconFromMessageType,
  getMessageType,
  getThumbnailUriFromFileMessage,
  isImage,
  shouldCompressImage,
  useIIFE,
} from '@gathertown/uikit-utils';

import { useLocalization, usePlatformService, useSendbirdChat } from '../../hooks/useContext';
import SBUError from '../../libs/SBUError';
import SBUUtils from '../../libs/SBUUtils';
import type { FileType } from '../../platform/types';
import type { MentionedUser } from '../../types';
import type { ChannelInputProps } from './index';

interface SendInputProps extends ChannelInputProps {
  text: string;
  onChangeText: (val: string) => void;
  onSelectionChange: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  mentionedUsers: MentionedUser[];
}

const SendInput = forwardRef<RNTextInput, SendInputProps>(function SendInput(
  {
    AttachmentsButton,
    onPressSendUserMessage,
    onPressSendFileMessage,
    text,
    onChangeText,
    onSelectionChange,
    mentionedUsers,
    inputDisabled,
    inputFrozen,
    inputMuted,
    channel,
    messageToReply,
    setMessageToReply,
  },
  ref,
) {
  const { mentionManager, sbOptions } = useSendbirdChat();
  const { select, colors, palette } = useUIKitTheme();
  const { STRINGS } = useLocalization();
  const { openSheet } = useBottomSheet();
  const toast = useToast();
  const { mediaService } = usePlatformService();

  const messageReplyParams = useIIFE(() => {
    const { groupChannel } = sbOptions.uikit;
    if (!channel.isGroupChannel() || groupChannel.channel.replyType === 'none' || !messageToReply) return {};
    return {
      parentMessageId: messageToReply.messageId,
      isReplyToChannel: true,
    };
  });

  const messageMentionParams = useIIFE(() => {
    const { groupChannel } = sbOptions.uikit;
    if (!channel.isGroupChannel() || !groupChannel.channel.enableMention) return {};
    return {
      mentionType: MentionType.USERS,
      mentionedUserIds: mentionedUsers.map((it) => it.user.userId),
      mentionedMessageTemplate: mentionManager.textToMentionedMessageTemplate(
        text,
        mentionedUsers,
        groupChannel.channel.enableMention,
      ),
    };
  });

  const onFailureToSend = (error: Error) => {
    toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error');
    Logger.error(STRINGS.TOAST.SEND_MSG_ERROR, error);
  };

  const sendUserMessage = () => {
    onPressSendUserMessage({
      message: text,
      ...messageMentionParams,
      ...messageReplyParams,
    }).catch(onFailureToSend);

    onChangeText('');
    setMessageToReply?.();
  };

  const sendFileMessage = (file: FileType) => {
    onPressSendFileMessage({
      file,
      ...messageReplyParams,
    }).catch(onFailureToSend);

    setMessageToReply?.();
  };

  const sheetItems = useChannelInputItems(channel, sendFileMessage);
  const onPressAttachment = () => openSheet({ sheetItems });

  const getPlaceholder = () => {
    if (inputMuted) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_MUTED;
    if (inputFrozen) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_DISABLED;
    if (inputDisabled) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_DISABLED;
    if (messageToReply) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_REPLY;

    return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_ACTIVE;
  };

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
        containerStyle={{
          backgroundColor: select({
            light: palette.background100,
            dark: palette.background500,
          }),
          width: 36,
          height: 36,
          borderRadius: 10,
          marginRight: 10,
          marginTop: 2,
        }}
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
        default:
          return getFileIconAsSymbol(getFileIconFromMessageType(messageType));
      }
    }
    return null;
  };

  return (
    <View>
      {messageToReply && (
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 18,
            paddingRight: 16,
            paddingTop: 10,
            paddingBottom: 8,
            alignItems: 'center',
            borderTopWidth: 1,
            borderColor: colors.onBackground04,
          }}
        >
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
            <Icon icon={'close'} size={24} color={colors.onBackground01} containerStyle={styles.iconSend} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.sendInputContainer}>
        {AttachmentsButton && <AttachmentsButton onPress={onPressAttachment} disabled={inputDisabled} />}
        <TextInput
          ref={ref}
          multiline
          disableFullscreenUI
          onSelectionChange={onSelectionChange}
          editable={!inputDisabled}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={getPlaceholder()}
        >
          {mentionManager.textToMentionedComponents(
            text,
            mentionedUsers,
            sbOptions.uikit.groupChannel.channel.enableMention,
          )}
        </TextInput>

        {Boolean(text.trim()) && (
          <TouchableOpacity onPress={sendUserMessage} disabled={inputDisabled}>
            <Icon
              color={
                inputDisabled ? colors.ui.input.default.disabled.highlight : colors.ui.input.default.active.highlight
              }
              icon={'send'}
              size={24}
              containerStyle={styles.iconSend}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const useChannelInputItems = (channel: SendbirdChannel, sendFileMessage: (file: FileType) => void) => {
  const { sbOptions, imageCompressionConfig } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { fileService, mediaService } = usePlatformService();
  const { alert } = useAlert();
  const toast = useToast();

  const sheetItems: BottomSheetItem['sheetItems'] = [];
  const input = useIIFE(() => {
    switch (true) {
      case channel.isOpenChannel():
        return sbOptions.uikit.openChannel.channel.input;
      case channel.isGroupChannel():
        return sbOptions.uikit.groupChannel.channel.input;
      default:
        return {
          enableDocument: true,
          camera: { enablePhoto: true, enableVideo: true },
          gallery: { enablePhoto: true, enableVideo: true },
        };
    }
  });

  if (input.camera.enablePhoto) {
    sheetItems.push({
      title: STRINGS.LABELS.CHANNEL_INPUT_ATTACHMENT_CAMERA_PHOTO,
      icon: 'camera',
      onPress: async () => {
        const mediaFile = await fileService.openCamera({
          mediaType: 'photo',
          onOpenFailure: (error) => {
            if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
              alert({
                title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                  STRINGS.LABELS.PERMISSION_CAMERA,
                  STRINGS.LABELS.PERMISSION_APP_NAME,
                ),
                buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
              });
            } else {
              toast.show(STRINGS.TOAST.OPEN_CAMERA_ERROR, 'error');
            }
          },
        });

        if (mediaFile) {
          // Image compression
          if (
            isImage(mediaFile.uri, mediaFile.type) &&
            shouldCompressImage(mediaFile.type, sbOptions.chat.imageCompressionEnabled)
          ) {
            await SBUUtils.safeRun(async () => {
              const compressed = await mediaService.compressImage({
                uri: mediaFile.uri,
                maxWidth: imageCompressionConfig.width,
                maxHeight: imageCompressionConfig.height,
                compressionRate: imageCompressionConfig.compressionRate,
              });

              if (compressed) {
                mediaFile.uri = compressed.uri;
                mediaFile.size = compressed.size;
              }
            });
          }

          sendFileMessage(mediaFile);
        }
      },
    });
  }

  if (input.camera.enableVideo) {
    sheetItems.push({
      title: STRINGS.LABELS.CHANNEL_INPUT_ATTACHMENT_CAMERA_VIDEO,
      icon: 'camera',
      onPress: async () => {
        const mediaFile = await fileService.openCamera({
          mediaType: 'video',
          onOpenFailure: (error) => {
            if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
              alert({
                title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                  STRINGS.LABELS.PERMISSION_CAMERA,
                  STRINGS.LABELS.PERMISSION_APP_NAME,
                ),
                buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
              });
            } else {
              toast.show(STRINGS.TOAST.OPEN_CAMERA_ERROR, 'error');
            }
          },
        });

        if (mediaFile) {
          sendFileMessage(mediaFile);
        }
      },
    });
  }

  if (input.gallery.enablePhoto || input.gallery.enableVideo) {
    const mediaType = (() => {
      switch (true) {
        case input.gallery.enablePhoto && input.gallery.enableVideo:
          return 'all';
        case input.gallery.enablePhoto && !input.gallery.enableVideo:
          return 'photo';
        case !input.gallery.enablePhoto && input.gallery.enableVideo:
          return 'video';
        default:
          return 'all';
      }
    })();

    sheetItems.push({
      title: STRINGS.LABELS.CHANNEL_INPUT_ATTACHMENT_PHOTO_LIBRARY,
      icon: 'photo',
      onPress: async () => {
        const mediaFiles = await fileService.openMediaLibrary({
          selectionLimit: 1,
          mediaType,
          onOpenFailure: (error) => {
            if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
              alert({
                title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                  STRINGS.LABELS.PERMISSION_DEVICE_STORAGE,
                  STRINGS.LABELS.PERMISSION_APP_NAME,
                ),
                buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
              });
            } else {
              toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error');
            }
          },
        });

        if (mediaFiles && mediaFiles[0]) {
          const mediaFile = mediaFiles[0];

          // Image compression
          if (
            isImage(mediaFile.uri, mediaFile.type) &&
            shouldCompressImage(mediaFile.type, sbOptions.chat.imageCompressionEnabled)
          ) {
            await SBUUtils.safeRun(async () => {
              const compressed = await mediaService.compressImage({
                uri: mediaFile.uri,
                maxWidth: imageCompressionConfig.width,
                maxHeight: imageCompressionConfig.height,
                compressionRate: imageCompressionConfig.compressionRate,
              });

              if (compressed) {
                mediaFile.uri = compressed.uri;
                mediaFile.size = compressed.size;
              }
            });
          }

          sendFileMessage(mediaFile);
        }
      },
    });
  }

  if (input.enableDocument) {
    sheetItems.push({
      title: STRINGS.LABELS.CHANNEL_INPUT_ATTACHMENT_FILES,
      icon: 'document',
      onPress: async () => {
        const documentFile = await fileService.openDocument({
          onOpenFailure: () => toast.show(STRINGS.TOAST.OPEN_FILES_ERROR, 'error'),
        });

        if (documentFile) {
          // Image compression
          if (
            isImage(documentFile.uri, documentFile.type) &&
            shouldCompressImage(documentFile.type, sbOptions.chat.imageCompressionEnabled)
          ) {
            await SBUUtils.safeRun(async () => {
              const compressed = await mediaService.compressImage({
                uri: documentFile.uri,
                maxWidth: imageCompressionConfig.width,
                maxHeight: imageCompressionConfig.height,
                compressionRate: imageCompressionConfig.compressionRate,
              });

              if (compressed) {
                documentFile.uri = compressed.uri;
                documentFile.size = compressed.size;
              }
            });
          }

          sendFileMessage(documentFile);
        }
      },
    });
  }

  return sheetItems;
};

const styles = createStyleSheet({
  sendInputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    marginRight: 4,
    minHeight: 36,
    maxHeight: 36 * Platform.select({ ios: 2.5, default: 2 }),
    borderRadius: 20,
  },
  iconSend: {
    marginLeft: 4,
    padding: 4,
  },
  previewImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginTop: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
});

export default SendInput;
