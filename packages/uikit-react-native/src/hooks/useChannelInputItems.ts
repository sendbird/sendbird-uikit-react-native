import { BottomSheetItem, useAlert, useToast } from '@sendbird/uikit-react-native-foundation';
import { SendbirdChannel, isImage, shouldCompressImage, useIIFE } from '@sendbird/uikit-utils';

import SBUError from '../libs/SBUError';
import SBUUtils from '../libs/SBUUtils';
import { FileType } from '../platform/types';
import { useLocalization, usePlatformService, useSendbirdChat } from './useContext';

export const useChannelInputItems = (channel: SendbirdChannel, sendFileMessage: (file: FileType) => void) => {
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
