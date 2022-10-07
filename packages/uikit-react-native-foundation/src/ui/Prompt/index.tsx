import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, TextInput as RNTextInput, View, useWindowDimensions } from 'react-native';

import { NOOP } from '@sendbird/uikit-utils';

import Modal from '../../components/Modal';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import createStyleSheet from '../../styles/createStyleSheet';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Button from '../Button';
import DialogBox from '../Dialog/DialogBox';

export type PromptItem = {
  title: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit?: (text: string) => void;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
};

type Props = {
  visible: boolean;
  onHide: () => void;
  onDismiss?: () => void;
  autoFocus?: boolean;
} & PromptItem;
const Prompt = ({
  onDismiss,
  visible,
  onHide,
  autoFocus = true,
  title,
  defaultValue = '',
  placeholder = 'Enter',
  onSubmit = NOOP,
  onCancel = NOOP,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
}: Props) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { colors } = useUIKitTheme();
  const inputRef = useRef<RNTextInput>(null);
  const { width, height } = useWindowDimensions();

  const buttons = [
    { text: cancelLabel, onPress: onCancel },
    { text: submitLabel, onPress: () => onSubmit(text) },
  ];

  const [text, setText] = useState(defaultValue);

  // FIXME: autoFocus trick with modal
  // Android
  // - InputProps.autoFocus is not trigger keyboard appearing.
  // - InputRef.focus() is trigger keyboard appearing, but position of keyboard selection is always the start of text.
  // iOS
  // - InputProps.autoFocus is trigger weird UI behavior on landscape mode.
  useEffect(() => {
    if (autoFocus && visible) {
      setTimeout(() => {
        if (Platform.OS === 'android') inputRef.current?.blur();
        inputRef.current?.focus();
      }, 250);
    }
  }, [autoFocus, visible, `${width}-${height}`]);

  return (
    <Modal
      enableKeyboardAvoid
      disableBackgroundClose
      onClose={onHide}
      onDismiss={() => {
        setText('');
        onDismiss?.();
      }}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <DialogBox style={styles.container}>
        {Boolean(title) && (
          <View style={styles.titleContainer}>
            <Text h1 color={colors.ui.dialog.default.none.text} numberOfLines={1} style={{ flex: 1 }}>
              {title}
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={autoFocus && Platform.OS === 'android'}
            ref={inputRef}
            placeholder={placeholder}
            variant={'underline'}
            value={text}
            onChangeText={setText}
            style={{ paddingHorizontal: 0, paddingVertical: 10 }}
          />
        </View>

        <View style={styles.buttonContainer}>
          {buttons.map(({ text, onPress }, index) => {
            return (
              <Button
                key={text + index}
                variant={'text'}
                style={styles.button}
                contentColor={colors.ui.dialog.default.none.highlight}
                onPress={() => {
                  Keyboard.dismiss();
                  try {
                    onPress?.();
                  } finally {
                    onHide();
                  }
                }}
              >
                {text}
              </Button>
            );
          })}
        </View>
      </DialogBox>
    </Modal>
  );
};

const styles = createStyleSheet({
  container: {
    paddingTop: 8,
  },
  titleContainer: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
  },
  button: {
    marginLeft: 8,
  },
});

export default Prompt;
