import { useEffect, useRef, useState } from 'react';
import type { NativeSyntheticEvent, TextInput, TextInputSelectionChangeEventData } from 'react-native';
import { Platform } from 'react-native';

import { SendbirdFileMessage, SendbirdUserMessage, replace, useFreshCallback } from '@sendbird/uikit-utils';

import type { MentionedUser } from '../types';
import { useSendbirdChat } from './useContext';

const useMentionTextInput = (params: { messageToEdit?: SendbirdUserMessage | SendbirdFileMessage }) => {
  const { mentionManager } = useSendbirdChat();

  const mentionedUsersRef = useRef<MentionedUser[]>([]);
  const textInputRef = useRef<TextInput>();

  const [text, setText] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // TODO: Refactor text edit logic more clearly
  useEffect(() => {
    if (mentionManager.shouldUseMentionedMessageTemplate(params.messageToEdit)) {
      const result = mentionManager.templateToTextAndMentionedUsers(
        params.messageToEdit.mentionedMessageTemplate,
        params.messageToEdit.mentionedUsers,
      );

      mentionedUsersRef.current = result.mentionedUsers;
      setText(result.mentionedText);
    } else {
      mentionedUsersRef.current = [];
      if (params.messageToEdit?.isUserMessage()) {
        setText(params.messageToEdit.message);
      }
    }
  }, [params.messageToEdit]);

  const onChangeText = useFreshCallback((_nextText: string, addedMentionedUser?: MentionedUser) => {
    const prevText = text;
    let nextText = _nextText;
    let offset = nextText.length - prevText.length;

    // Text clear
    if (nextText === '') {
      mentionedUsersRef.current = [];
    }
    // Text add
    else if (offset > 0) {
      /** Add mentioned user **/
      if (addedMentionedUser) mentionedUsersRef.current.push(addedMentionedUser);

      /** Reconcile mentioned users range on the right side of the selection **/
      mentionedUsersRef.current = mentionManager.reconcileRangeOfMentionedUsers(
        offset,
        selection.end,
        mentionedUsersRef.current,
      );
    }
    // Text remove
    else if (offset < 0) {
      // Ranged remove
      if (selection.start !== selection.end) {
        /** Filter mentioned users in selection range **/
        const { filtered, lastSelection } = mentionManager.removeMentionedUsersInSelection(
          selection,
          mentionedUsersRef.current,
        );

        /** Reconcile mentioned users range on the right side of the selection **/
        mentionedUsersRef.current = mentionManager.reconcileRangeOfMentionedUsers(
          offset,
          Math.max(selection.end, lastSelection),
          filtered,
        );
      }
      // Single remove
      else {
        /** Find mentioned user who ranges in removed selection **/
        const foundIndex = mentionedUsersRef.current.findIndex((it) =>
          mentionManager.rangeHelpers.overlaps(it.range, selection, 'underMore'),
        );
        /** If found, remove from the mentioned user list and remove remainder text **/
        if (foundIndex > -1) {
          const it = mentionedUsersRef.current[foundIndex];
          const remainderLength = it.range.end - it.range.start + offset;

          offset = -remainderLength + offset;
          nextText = replace(nextText, it.range.start, it.range.start + remainderLength, '');

          mentionedUsersRef.current.splice(foundIndex, 1);
        }

        /** Reconcile mentioned users range on the right side of the selection **/
        mentionedUsersRef.current = mentionManager.reconcileRangeOfMentionedUsers(
          offset,
          selection.end,
          mentionedUsersRef.current,
        );
      }
    }

    setText(nextText);
  });

  return {
    textInputRef,
    selection,
    onSelectionChange: useFreshCallback((e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      const nativeSelection = { ...e.nativeEvent.selection };

      // NOTE: To synchronize call onSelectionChange after onChangeText called on each platform.
      setTimeout(() => {
        const mentionedUser = mentionedUsersRef.current.find((it) =>
          mentionManager.rangeHelpers.overlaps(it.range, nativeSelection),
        );

        // Selection should be blocked if changed into mentioned area
        if (mentionedUser) {
          const selectionBlock = { start: mentionedUser.range.start, end: mentionedUser.range.end };
          textInputRef.current?.setNativeProps({ selection: selectionBlock });
          // BUG: setNativeProps called again when invoked onChangeText
          //  https://github.com/facebook/react-native/issues/33520
          if (Platform.OS === 'android') {
            setTimeout(() => {
              textInputRef.current?.setNativeProps({ selection: { start: 0 } });
            }, 250);
          }
          setSelection(selectionBlock);
        } else {
          setSelection(nativeSelection);
        }
      }, 10);
    }),
    text,
    onChangeText,
    mentionedUsers: mentionedUsersRef.current,
  };
};

export default useMentionTextInput;
