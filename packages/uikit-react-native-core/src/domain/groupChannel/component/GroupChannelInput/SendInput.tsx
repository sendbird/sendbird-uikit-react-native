import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

import {
  Icon,
  TextInput,
  createStyleSheet,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { conditionChaining } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../../contexts/Localization';
import { usePlatformService } from '../../../../contexts/PlatformService';
import type { GroupChannelProps } from '../../types';

type SendInputProps = GroupChannelProps['Input'] & {
  text: string;
  setText: (val: string) => void;
  disabled: boolean;
};
const SendInput: React.FC<SendInputProps> = ({ onSendUserMessage, onSendFileMessage, text, setText, disabled }) => {
  const { LABEL } = useLocalization();
  const { openSheet } = useBottomSheet();
  const { fileService } = usePlatformService();
  const { colors } = useUIKitTheme();
  const toast = useToast();

  const onPressSend = () => {
    onSendUserMessage(text).catch(() => toast.show(LABEL.TOAST.SEND_MSG_ERROR, 'error'));
    setText('');
  };
  const onPressAttachment = () => {
    openSheet({
      sheetItems: [
        {
          title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_ATTACHMENT_CAMERA,
          icon: 'camera',
          onPress: async () => {
            const photo = await fileService.openCamera({
              mediaType: 'photo',
              onError: () => toast.show(LABEL.TOAST.OPEN_CAMERA_ERROR, 'error'),
            });

            if (photo) {
              onSendFileMessage(photo).catch(() => toast.show(LABEL.TOAST.SEND_MSG_ERROR, 'error'));
            }
          },
        },
        {
          title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_ATTACHMENT_PHOTO_LIBRARY,
          icon: 'photo',
          onPress: async () => {
            const photo = await fileService.openMediaLibrary({
              selectionLimit: 1,
              mediaType: 'photo',
              onError: () => toast.show(LABEL.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error'),
            });

            if (photo && photo[0]) {
              onSendFileMessage(photo[0]).catch(() => toast.show(LABEL.TOAST.SEND_MSG_ERROR, 'error'));
            }
          },
        },
        {
          title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_ATTACHMENT_FILES,
          icon: 'document',
          onPress: async () => {
            const file = await fileService.openDocument({
              onError: () => toast.show(LABEL.TOAST.OPEN_FILES_ERROR, 'error'),
            });

            if (file) {
              onSendFileMessage(file).catch(() => toast.show(LABEL.TOAST.SEND_MSG_ERROR, 'error'));
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
        multiline
        editable={!disabled}
        value={text}
        onChangeText={setText}
        style={styles.input}
        placeholder={conditionChaining(
          [disabled],
          [
            LABEL.GROUP_CHANNEL.FRAGMENT.INPUT_PLACEHOLDER_DISABLED,
            LABEL.GROUP_CHANNEL.FRAGMENT.INPUT_PLACEHOLDER_ACTIVE,
          ],
        )}
      />
      {Boolean(text) && (
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
