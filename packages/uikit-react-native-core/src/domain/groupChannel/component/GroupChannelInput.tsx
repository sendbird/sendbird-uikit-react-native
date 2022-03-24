import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Icon,
  TextInput,
  createStyleSheet,
  useBottomSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { groupChannelChatUnavailable } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import { usePlatformService } from '../../../contexts/PlatformService';
import type { GroupChannelProps } from '../types';

const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({ ios: 'padding' as const, default: undefined });
const GroupChannelInput: React.FC<GroupChannelProps['Input']> = ({ channel, onSendFileMessage, onSendUserMessage }) => {
  const { left, right, bottom } = useSafeAreaInsets();
  const { colors } = useUIKitTheme();
  const { LABEL } = useLocalization();
  const { openSheet } = useBottomSheet();
  const { filePickerService } = usePlatformService();

  const [text, setText] = useState('');
  const textTmpRef = useRef('');
  const disabled = groupChannelChatUnavailable(channel);

  useEffect(() => {
    if (text.length === 0) channel.endTyping();
    else channel.startTyping();
  }, [text]);

  useEffect(() => {
    if (disabled) {
      textTmpRef.current = text;
      setText('');
    } else {
      setText(textTmpRef.current);
    }
  }, [disabled]);

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={-bottom} behavior={KEYBOARD_AVOID_VIEW_BEHAVIOR}>
      <View style={{ paddingLeft: left, paddingRight: right, backgroundColor: colors.background }}>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => {
              openSheet({
                sheetItems: [
                  {
                    title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_ATTACHMENT_CAMERA,
                    icon: 'camera',
                    onPress: async () => {
                      const photo = await filePickerService.openCamera({ mediaType: 'photo' });
                      if (photo) onSendFileMessage(photo);
                    },
                  },
                  {
                    title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_ATTACHMENT_PHOTO_LIBRARY,
                    icon: 'photo',
                    onPress: async () => {
                      const photo = await filePickerService.openMediaLibrary({ selectionLimit: 1, mediaType: 'photo' });
                      if (photo && photo[0]) onSendFileMessage(photo[0]);
                    },
                  },
                  {
                    title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_ATTACHMENT_FILES,
                    icon: 'document',
                    onPress: async () => {
                      const file = await filePickerService.openDocument();
                      if (file) onSendFileMessage(file);
                    },
                  },
                ],
              });
            }}
            disabled={disabled}
          >
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
            placeholder={
              disabled
                ? LABEL.GROUP_CHANNEL.FRAGMENT.INPUT_PLACEHOLDER_DISABLED
                : LABEL.GROUP_CHANNEL.FRAGMENT.INPUT_PLACEHOLDER_ACTIVE
            }
          />
          {Boolean(text) && (
            <TouchableOpacity
              onPress={() => {
                onSendUserMessage(text);
                setText('');
              }}
              disabled={disabled}
            >
              <Icon
                color={disabled ? colors.ui.input.default.disabled.highlight : colors.ui.input.default.active.highlight}
                icon={'send'}
                size={24}
                containerStyle={styles.iconSend}
              />
            </TouchableOpacity>
          )}
        </View>
        <SafeAreaBottom height={bottom} />
      </View>
    </KeyboardAvoidingView>
  );
};

const SafeAreaBottom: React.FC<{ height: number }> = ({ height }) => {
  return <View style={{ height }} />;
};
const styles = createStyleSheet({
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
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

export default GroupChannelInput;
