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
import {
  Icon,
  TextInput,
  createStyleSheet,
  useAlert,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { conditionChaining, isImage, shouldCompressImage } from '@sendbird/uikit-utils';

import { useLocalization, usePlatformService, useSendbirdChat } from '../../../../hooks/useContext';
import SBUError from '../../../../libs/SBUError';
import SBUUtils from '../../../../libs/SBUUtils';
import type { MentionedUser } from '../../../../types';
import type { GroupChannelProps } from '../../types';

type SendInputProps = GroupChannelProps['Input'] & {
  text: string;
  onChangeText: (val: string) => void;
  frozen: boolean;
  muted: boolean;
  disabled: boolean;
  onSelectionChange: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  mentionedUsers: MentionedUser[];
};
const SendInput = forwardRef<RNTextInput, SendInputProps>(function SendInput(
  {
    onSendUserMessage,
    onSendFileMessage,
    text,
    onChangeText,
    disabled,
    frozen,
    muted,
    onSelectionChange,
    mentionedUsers,
  },
  ref,
) {
  const { mentionManager, imageCompressionConfig, features } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { fileService, mediaService } = usePlatformService();
  const { colors } = useUIKitTheme();
  const { openSheet } = useBottomSheet();
  const { alert } = useAlert();
  const toast = useToast();

  const onPressSend = () => {
    const mention = {
      userIds: mentionedUsers.map((it) => it.user.userId),
      messageTemplate: mentionManager.textToMentionedMessageTemplate(text, mentionedUsers),
      type: MentionType.USERS,
    };

    onSendUserMessage(text, mention).catch(() => toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error'));
    onChangeText('');
  };

  const onPressAttachment = () => {
    openSheet({
      sheetItems: [
        {
          title: STRINGS.GROUP_CHANNEL.DIALOG_ATTACHMENT_CAMERA,
          icon: 'camera',
          onPress: async () => {
            const mediaFile = await fileService.openCamera({
              mediaType: 'all',
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
                shouldCompressImage(mediaFile.uri, features.imageCompressionEnabled)
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

              onSendFileMessage(mediaFile).catch(() => toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error'));
            }
          },
        },
        {
          title: STRINGS.GROUP_CHANNEL.DIALOG_ATTACHMENT_PHOTO_LIBRARY,
          icon: 'photo',
          onPress: async () => {
            const mediaFiles = await fileService.openMediaLibrary({
              selectionLimit: 1,
              mediaType: 'all',
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
                shouldCompressImage(mediaFile.uri, features.imageCompressionEnabled)
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

              onSendFileMessage(mediaFiles[0]).catch(() => toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error'));
            }
          },
        },
        {
          title: STRINGS.GROUP_CHANNEL.DIALOG_ATTACHMENT_FILES,
          icon: 'document',
          onPress: async () => {
            const documentFile = await fileService.openDocument({
              onOpenFailure: () => toast.show(STRINGS.TOAST.OPEN_FILES_ERROR, 'error'),
            });

            if (documentFile) {
              // Image compression
              if (
                isImage(documentFile.uri, documentFile.type) &&
                shouldCompressImage(documentFile.uri, features.imageCompressionEnabled)
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

              onSendFileMessage(documentFile).catch(() => toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error'));
            }
          },
        },
      ],
    });
  };

  return (
    <View style={styles.sendInputContainer}>
      <TouchableOpacity onPress={onPressAttachment} disabled={disabled}>
        <Icon
          color={disabled ? colors.ui.input.default.disabled.highlight : colors.ui.input.default.active.highlight}
          icon={'add'}
          size={24}
          containerStyle={styles.iconAttach}
        />
      </TouchableOpacity>
      <TextInput
        ref={ref}
        multiline
        disableFullscreenUI
        onSelectionChange={onSelectionChange}
        editable={!disabled}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={conditionChaining(
          [frozen, muted],
          [
            STRINGS.GROUP_CHANNEL.INPUT_PLACEHOLDER_DISABLED,
            STRINGS.GROUP_CHANNEL.INPUT_PLACEHOLDER_MUTED,
            STRINGS.GROUP_CHANNEL.INPUT_PLACEHOLDER_ACTIVE,
          ],
        )}
      >
        {mentionManager.textToMentionedComponents(text, mentionedUsers)}
      </TextInput>

      {Boolean(text.trim()) && (
        <TouchableOpacity onPress={onPressSend} disabled={disabled}>
          <Icon
            color={disabled ? colors.ui.input.default.disabled.highlight : colors.ui.input.default.active.highlight}
            icon={'send'}
            size={24}
            containerStyle={styles.iconSend}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

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
  iconAttach: {
    marginRight: 8,
    padding: 4,
  },
  iconSend: {
    marginLeft: 4,
    padding: 4,
  },
});

export default SendInput;
