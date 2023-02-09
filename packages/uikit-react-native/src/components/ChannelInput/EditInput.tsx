import React, { forwardRef } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';

import { MentionType } from '@sendbird/chat/message';
import { Button, TextInput, createStyleSheet, useToast } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdFileMessage, SendbirdUserMessage } from '@sendbird/uikit-utils';

import { useLocalization, useSendbirdChat } from '../../hooks/useContext';
import type { MentionedUser } from '../../types';
import type { ChannelInputProps } from './index';

interface EditInputProps extends ChannelInputProps {
  text: string;
  onChangeText: (val: string) => void;
  messageToEdit: SendbirdUserMessage | SendbirdFileMessage;
  setMessageToEdit: (msg?: SendbirdUserMessage | SendbirdFileMessage) => void;
  onSelectionChange: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  autoFocus: boolean;
  mentionedUsers: MentionedUser[];
}

const EditInput = forwardRef<RNTextInput, EditInputProps>(function EditInput(
  {
    text,
    onChangeText,
    messageToEdit,
    setMessageToEdit,
    onPressUpdateUserMessage,
    onUpdateUserMessage,
    onSelectionChange,
    autoFocus,
    mentionedUsers,
    inputDisabled,
  },
  ref,
) {
  const { mentionManager } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const toast = useToast();

  const onPressCancel = () => {
    setMessageToEdit();
    onChangeText('');
  };

  const onPressSave = () => {
    if (messageToEdit.isUserMessage()) {
      const mentionType = MentionType.USERS;
      const mentionedUserIds = mentionedUsers.map((it) => it.user.userId);
      const mentionedMessageTemplate = mentionManager.textToMentionedMessageTemplate(text, mentionedUsers);

      if (onPressUpdateUserMessage) {
        onPressUpdateUserMessage(messageToEdit, {
          message: text,
          mentionType,
          mentionedUserIds,
          mentionedMessageTemplate,
        }).catch(onFailureToUpdate);
      } else if (onUpdateUserMessage) {
        onUpdateUserMessage(text, messageToEdit, {
          type: MentionType.USERS,
          userIds: mentionedUserIds,
          messageTemplate: mentionedMessageTemplate,
        }).catch(onFailureToUpdate);
      }
    }
    setMessageToEdit();
    onChangeText('');
  };

  const onFailureToUpdate = () => toast.show(STRINGS.TOAST.UPDATE_MSG_ERROR, 'error');

  return (
    <View style={styles.editInputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          multiline
          disableFullscreenUI
          editable={!inputDisabled}
          autoFocus={autoFocus}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_ACTIVE}
          onSelectionChange={onSelectionChange}
        >
          {mentionManager.textToMentionedComponents(text, mentionedUsers)}
        </TextInput>
      </View>
      <View style={{ marginTop: 8, flexDirection: 'row' }}>
        <Button variant={'text'} onPress={onPressCancel}>
          {STRINGS.LABELS.CHANNEL_INPUT_EDIT_CANCEL}
        </Button>
        <View style={styles.space} />
        <Button variant={'contained'} onPress={onPressSave}>
          {STRINGS.LABELS.CHANNEL_INPUT_EDIT_OK}
        </Button>
      </View>
    </View>
  );
});

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
