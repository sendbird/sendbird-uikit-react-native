import React, { useEffect, useRef } from 'react';
import { Platform, TextInput as RNTextInput, View } from 'react-native';

import { Button, TextInput, createStyleSheet, useToast } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdFileMessage, SendbirdUserMessage } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../../contexts/Localization';
import type { GroupChannelProps } from '../../types';

type EditInputProps = GroupChannelProps['Input'] & {
  text: string;
  setText: (val: string) => void;
  editMessage: SendbirdUserMessage | SendbirdFileMessage;
  setEditMessage: (msg?: SendbirdUserMessage | SendbirdFileMessage) => void;
};

const AUTO_FOCUS = Platform.select({ ios: false, android: true, default: false });
const EditInput: React.FC<EditInputProps> = ({ text, setText, editMessage, setEditMessage, onUpdateUserMessage }) => {
  const { STRINGS } = useLocalization();
  const inputRef = useRef<RNTextInput>(null);
  const toast = useToast();

  useEffect(() => {
    if (editMessage.isUserMessage()) {
      setText(editMessage.message ?? '');

      if (!AUTO_FOCUS) setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [editMessage]);

  const onPressCancel = () => {
    setEditMessage();
    setText('');
  };

  const onPressSave = () => {
    if (editMessage.isUserMessage()) {
      onUpdateUserMessage(text, editMessage).catch(() => toast.show(STRINGS.TOAST.UPDATE_MSG_ERROR, 'error'));
    }
    setEditMessage();
    setText('');
  };

  return (
    <View style={styles.editInputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          autoFocus={AUTO_FOCUS}
          ref={inputRef}
          multiline
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder={STRINGS.GROUP_CHANNEL.INPUT_PLACEHOLDER_ACTIVE}
        />
      </View>
      <View style={{ marginTop: 8, flexDirection: 'row' }}>
        <Button variant={'text'} onPress={onPressCancel}>
          {STRINGS.GROUP_CHANNEL.INPUT_EDIT_CANCEL}
        </Button>
        <View style={styles.space} />
        <Button variant={'contained'} onPress={onPressSave}>
          {STRINGS.GROUP_CHANNEL.INPUT_EDIT_OK}
        </Button>
      </View>
    </View>
  );
};

const styles = createStyleSheet({
  editInputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 4,
    minHeight: 36,
    maxHeight: 36 * Platform.select({ ios: 2.5, default: 2 }),
    borderRadius: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  space: {
    flex: 1,
  },
});

export default EditInput;
