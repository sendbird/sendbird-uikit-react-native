import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { SendbirdMember, getGroupChannelChatAvailableState, replace, useIIFE } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../../../../hooks/useContext';
import { GroupChannelContexts } from '../../module/moduleContext';
import type { GroupChannelProps } from '../../types';
import EditInput from './EditInput';
import SendInput from './SendInput';

const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({ ios: 'padding' as const, default: undefined });

const useTextInputSelection = () => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textInputRef = useRef<TextInput>();

  return {
    textInputRef,
    selection,
    setSelection: useCallback((selection: { start: number; end: number }) => {
      textInputRef.current?.setNativeProps({ selection });
      setSelection(selection);
    }, []),
    onSelectionChange: useCallback((e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      setSelection(e.nativeEvent.selection);
    }, []),
  };
};

const GroupChannelInput = (props: GroupChannelProps['Input']) => {
  const { top, left, right, bottom } = useSafeAreaInsets();
  const { colors } = useUIKitTheme();
  const { features, mentionManager } = useSendbirdChat();
  const { channel, editMessage, setEditMessage, keyboardAvoidOffset = 0 } = useContext(GroupChannelContexts.Fragment);

  const [text, setText] = useState('');
  const mentionTemplate = useRef('');
  const updateMentionTemplate = (text: string, user: SendbirdMember) => {
    mentionTemplate.current = text;
    setMentionedUsers((prev) => ({ ...prev, user }));
  };

  const { setMentionedUsers } = mentionManager.useMentionTextInput();
  const { selection, setSelection, onSelectionChange, textInputRef } = useTextInputSelection();

  const [inputHeight, setInputHeight] = useState(styles.inputDefault.height);

  const textTmpRef = useRef('');
  const chatAvailableState = getGroupChannelChatAvailableState(channel);
  const mentionAvailable = features.mentionEnabled && channel.isGroupChannel() && !channel.isBroadcast;

  const onPressToMention: GroupChannelProps['MentionSuggestionList']['onPressToMention'] = (user, rangeInText) => {
    setText((prev) => {
      const [messageTemplate, messageText] = [
        mentionManager.asMentionedMessageTemplate,
        mentionManager.asMentionedMessageText,
      ].map((fn) => replace(prev, rangeInText.start, rangeInText.end, fn(user)));

      updateMentionTemplate(messageTemplate, user);
      return messageText;
    });
  };

  useEffect(() => {
    if (text.length === 0) channel.endTyping();
    else channel.startTyping();
  }, [text]);

  useEffect(() => {
    if (chatAvailableState.disabled) {
      textTmpRef.current = text;
      setText('');
    } else {
      setText(textTmpRef.current);
    }
  }, [chatAvailableState.disabled]);

  const inputMode = useIIFE(() => {
    if (!editMessage) return 'send';
    if (editMessage.isFileMessage()) return 'send';
    return 'edit';
  });

  if (!props.shouldRenderInput) {
    return <SafeAreaBottom height={bottom} />;
  }

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={-bottom + keyboardAvoidOffset}
        behavior={KEYBOARD_AVOID_VIEW_BEHAVIOR}
      >
        <View style={{ paddingLeft: left, paddingRight: right, backgroundColor: colors.background }}>
          {mentionAvailable && Platform.OS !== 'android' && (
            // NOTE: Android cannot recognize the scroll responder properly
            //  when has absolute ScrollView inside KeyboardAvoidingView
            <props.MentionSuggestionList
              text={text}
              selection={selection}
              inputHeight={inputHeight}
              topInset={top}
              bottomInset={bottom}
              onPressToMention={onPressToMention}
            />
          )}
          <View onLayout={(e) => setInputHeight(e.nativeEvent.layout.height)} style={styles.inputContainer}>
            {inputMode === 'send' && (
              <SendInput
                {...props}
                {...chatAvailableState}
                ref={textInputRef as never}
                text={text}
                setText={setText}
                setSelection={setSelection}
                onSelectionChange={onSelectionChange}
              />
            )}
            {inputMode === 'edit' && editMessage && (
              <EditInput
                {...props}
                text={text}
                setText={setText}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                disabled={chatAvailableState.disabled}
                onSelectionChange={onSelectionChange}
              />
            )}
          </View>
          <SafeAreaBottom height={bottom} />
        </View>
      </KeyboardAvoidingView>
      {mentionAvailable && Platform.OS === 'android' && (
        <props.MentionSuggestionList
          text={text}
          selection={selection}
          inputHeight={inputHeight}
          topInset={top}
          bottomInset={bottom}
          onPressToMention={onPressToMention}
        />
      )}
    </>
  );
};

const SafeAreaBottom = ({ height }: { height: number }) => {
  return <View style={{ height }} />;
};

const styles = createStyleSheet({
  inputContainer: {
    justifyContent: 'center',
    width: '100%',
  },
  inputDefault: {
    height: 56,
  },
});

export default React.memo(GroupChannelInput);
