import React, { MutableRefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import {
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMember,
  SendbirdUserMessage,
  getGroupChannelChatAvailableState,
  replace,
  useFreshCallback,
  useIIFE,
} from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../../../../hooks/useContext';
import type { MentionedUser, Range } from '../../../../types';
import { GroupChannelContexts } from '../../module/moduleContext';
import type { GroupChannelProps } from '../../types';
import EditInput from './EditInput';
import SendInput from './SendInput';

function inRange(start: number, num: number, end: number) {
  return start < num && num < end;
}

const AUTO_FOCUS = Platform.select({ ios: false, android: true, default: false });
const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({ ios: 'padding' as const, default: undefined });

const useTextInputSelection = (mentionedUsers: MentionedUser[]) => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textInputRef = useRef<TextInput>();

  return {
    textInputRef,
    selection,
    setSelection: useCallback((selection: Range) => {
      textInputRef.current?.setNativeProps({ selection });
      setSelection(selection);
    }, []),
    onSelectionChange: useFreshCallback((e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      const mentionedUser = mentionedUsers.find((it) => {
        return (
          inRange(it.range.start, e.nativeEvent.selection.start, it.range.end) ||
          inRange(it.range.start, e.nativeEvent.selection.end, it.range.end)
        );
      });

      // Selection should block if changed into mentioned area
      if (mentionedUser) {
        const selectionBlock = { start: mentionedUser.range.start, end: mentionedUser.range.end };
        textInputRef.current?.setNativeProps({ selection: selectionBlock });
        setSelection(selectionBlock);
      } else {
        setSelection(e.nativeEvent.selection);
      }
    }),
  };
};

const useTypingTrigger = (text: string, channel: SendbirdGroupChannel) => {
  useEffect(() => {
    if (text.length === 0) channel.endTyping();
    else channel.startTyping();
  }, [text]);
};

const usePersistText = (text: string, setText: (val: string) => void, chatDisabled: boolean) => {
  const textTmpRef = useRef('');

  useEffect(() => {
    if (chatDisabled) {
      textTmpRef.current = text;
      setText('');
    } else {
      setText(textTmpRef.current);
    }
  }, [chatDisabled]);
};

const useEditModeAutoFocus = (
  textInputRef: MutableRefObject<TextInput | undefined>,
  setText: (val: string) => void,
  editMessage?: SendbirdUserMessage | SendbirdFileMessage,
) => {
  useEffect(() => {
    if (editMessage?.isUserMessage()) {
      setText(editMessage.message ?? '');
      if (!AUTO_FOCUS) setTimeout(() => textInputRef.current?.focus(), 500);
    }
  }, [editMessage]);
};

const GroupChannelInput = (props: GroupChannelProps['Input']) => {
  const { top, left, right, bottom } = useSafeAreaInsets();
  const { colors } = useUIKitTheme();
  const { features, mentionManager } = useSendbirdChat();
  const { channel, editMessage, setEditMessage, keyboardAvoidOffset = 0 } = useContext(GroupChannelContexts.Fragment);

  const chatAvailableState = getGroupChannelChatAvailableState(channel);
  const mentionAvailable = features.mentionEnabled && channel.isGroupChannel() && !channel.isBroadcast;
  const inputMode = useIIFE(() => {
    if (!editMessage) return 'send';
    if (editMessage.isFileMessage()) return 'send';
    return 'edit';
  });

  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(styles.inputDefault.height);
  const [mentionedUsers, setMentionedUsers] = useState<MentionedUser[]>([]);

  const { selection, setSelection, onSelectionChange, textInputRef } = useTextInputSelection(mentionedUsers);

  useTypingTrigger(text, channel);
  usePersistText(text, setText, chatAvailableState.disabled);
  useEditModeAutoFocus(textInputRef, setText, editMessage);

  const updateMentionTemplate = (user: SendbirdMember, range: Range) => {
    setMentionedUsers((prev) => [...prev, { user, range }]);
  };

  const onPressToMention: GroupChannelProps['MentionSuggestionList']['onPressToMention'] = (
    user,
    searchStringRange,
  ) => {
    setText((prev) => {
      const mentionedMessageText = mentionManager.asMentionedMessageText(user);
      updateMentionTemplate(user, {
        start: searchStringRange.start,
        end: searchStringRange.start + mentionedMessageText.length - 1,
      });
      return replace(prev, searchStringRange.start, searchStringRange.end, mentionedMessageText);
    });
  };

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
              mentionedUsers={mentionedUsers}
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
                ref={textInputRef as never}
                autoFocus={AUTO_FOCUS}
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
          mentionedUsers={mentionedUsers}
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
