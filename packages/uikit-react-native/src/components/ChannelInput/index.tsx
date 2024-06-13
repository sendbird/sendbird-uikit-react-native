import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleProp, StyleSheet, TextInput, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import {
  SendbirdBaseChannel,
  SendbirdBaseMessage,
  SendbirdFileMessage,
  SendbirdFileMessageCreateParams,
  SendbirdFileMessageUpdateParams,
  SendbirdMember,
  SendbirdUserMessage,
  SendbirdUserMessageCreateParams,
  SendbirdUserMessageUpdateParams,
  replace,
  useIIFE,
} from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../../hooks/useContext';
import useMentionTextInput from '../../hooks/useMentionTextInput';
import type { CommonComponent, MentionedUser, Range } from '../../types';
import type { AttachmentsButtonProps } from './AttachmentsButton';
import AttachmentsButton from './AttachmentsButton';
import EditInput from './EditInput';
import type { MessageToReplyPreviewProps } from './MessageToReplyPreview';
import { MessageToReplyPreview } from './MessageToReplyPreview';
import SendInput from './SendInput';
import VoiceMessageInput, { VoiceMessageInputProps } from './VoiceMessageInput';

export type SuggestedMentionListProps = {
  text: string;
  selection: Range;
  topInset: number;
  bottomInset: number;
  inputHeight: number;
  onPressToMention: (user: SendbirdMember, searchStringRange: Range) => void;
  mentionedUsers: MentionedUser[];
};

export type ChannelInputProps = {
  // style
  style?: StyleProp<TextStyle>;

  // default
  channel: SendbirdBaseChannel;
  shouldRenderInput: boolean;
  keyboardAvoidOffset: number;

  // default actions
  onPressSendUserMessage: (params: SendbirdUserMessageCreateParams) => Promise<void>;
  onPressSendFileMessage: (params: SendbirdFileMessageCreateParams) => Promise<void>;
  onPressUpdateUserMessage: (message: SendbirdUserMessage, params: SendbirdUserMessageUpdateParams) => Promise<void>;
  onPressUpdateFileMessage: (message: SendbirdFileMessage, params: SendbirdFileMessageUpdateParams) => Promise<void>;

  // input status
  inputFrozen: boolean;
  inputMuted: boolean;
  inputDisabled: boolean;

  // edit
  messageToEdit: undefined | SendbirdUserMessage | SendbirdFileMessage;
  setMessageToEdit: (message?: undefined | SendbirdUserMessage | SendbirdFileMessage) => void;

  // reply - only available on group channel
  messageToReply?: undefined | SendbirdUserMessage | SendbirdFileMessage;
  setMessageToReply?: (message?: undefined | SendbirdUserMessage | SendbirdFileMessage) => void;
  messageForThread?: undefined | SendbirdUserMessage | SendbirdFileMessage;

  // mention
  SuggestedMentionList?: CommonComponent<SuggestedMentionListProps>;

  // sub-components
  AttachmentsButton?: (props: AttachmentsButtonProps) => React.ReactNode | null;
  MessageToReplyPreview?: (props: MessageToReplyPreviewProps) => React.ReactNode | null;
  VoiceMessageInput?: (props: VoiceMessageInputProps) => React.ReactNode | null;
};

const AUTO_FOCUS = Platform.select({ ios: false, android: true, default: false });
const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({ ios: 'padding' as const, default: undefined });

// FIXME(iOS): Dynamic style does not work properly when typing the CJK. (https://github.com/facebook/react-native/issues/26107)
//  To workaround temporarily, change the key for re-mount the component.
//  -> This will affect to keyboard blur when add/remove first mentioned user.
const GET_INPUT_KEY = (shouldReset: boolean) => (shouldReset ? 'uikit-input-clear' : 'uikit-input');

// TODO: Refactor 'Edit' mode to clearly
const ChannelInput = (props: ChannelInputProps) => {
  const { channel, keyboardAvoidOffset, messageToEdit, setMessageToEdit } = props;

  const { top, left, right, bottom } = useSafeAreaInsets();
  const { colors, typography } = useUIKitTheme();
  const { sbOptions, mentionManager } = useSendbirdChat();

  const { selection, onSelectionChange, textInputRef, text, onChangeText, mentionedUsers } = useMentionTextInput({
    messageToEdit,
  });
  const inputMode = useIIFE(() => {
    if (messageToEdit && !messageToEdit.isFileMessage()) return 'edit';
    else return 'send';
  });

  const mentionAvailable =
    sbOptions.uikit.groupChannel.channel.enableMention && channel.isGroupChannel() && !channel.isBroadcast;
  const inputKeyToRemount = GET_INPUT_KEY(mentionAvailable ? mentionedUsers.length === 0 : false);

  const [inputHeight, setInputHeight] = useState(styles.inputDefault.height);

  const fontStyle = useMemo(() => {
    if (!typography.body3.fontSize) return typography.body3;
    // NOTE: iOS does not support textAlignVertical, so we should adjust lineHeight to center the text in multiline TextInput.
    return { ...typography.body3, lineHeight: typography.body3.fontSize * 1.275, textAlignVertical: 'center' };
  }, [typography.body3.fontSize]);

  const textInputStyle = StyleSheet.flatten([styles.input, fontStyle, props.style]);

  useTypingTrigger(text, channel);
  useTextClearOnDisabled(onChangeText, props.inputDisabled);
  useAutoFocusOnEditMode(textInputRef, messageToEdit);

  const onPressToMention = (user: SendbirdMember, searchStringRange: Range) => {
    const mentionedMessageText = mentionManager.asMentionedMessageText(user, true);
    const range = { start: searchStringRange.start, end: searchStringRange.start + mentionedMessageText.length - 1 };

    onChangeText(replace(text, searchStringRange.start, searchStringRange.end, mentionedMessageText), { user, range });
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
          <View onLayout={(e) => setInputHeight(e.nativeEvent.layout.height)} style={styles.inputContainer}>
            {inputMode === 'send' && (
              <SendInput
                {...props}
                key={inputKeyToRemount}
                ref={textInputRef as never}
                text={text}
                onChangeText={onChangeText}
                onSelectionChange={onSelectionChange}
                mentionedUsers={mentionedUsers}
                VoiceMessageInput={props.VoiceMessageInput ?? VoiceMessageInput}
                AttachmentsButton={props.AttachmentsButton ?? AttachmentsButton}
                MessageToReplyPreview={props.MessageToReplyPreview ?? MessageToReplyPreview}
                style={textInputStyle}
              />
            )}
            {inputMode === 'edit' && messageToEdit && (
              <EditInput
                {...props}
                key={inputKeyToRemount}
                ref={textInputRef as never}
                text={text}
                onChangeText={onChangeText}
                autoFocus={AUTO_FOCUS}
                onSelectionChange={onSelectionChange}
                mentionedUsers={mentionedUsers}
                messageToEdit={messageToEdit}
                setMessageToEdit={setMessageToEdit}
                style={textInputStyle}
              />
            )}
          </View>
          <SafeAreaBottom height={bottom} />
        </View>
      </KeyboardAvoidingView>
      {mentionAvailable && props.SuggestedMentionList && (
        <props.SuggestedMentionList
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

const useTypingTrigger = (text: string, channel: SendbirdBaseChannel) => {
  if (channel.isGroupChannel()) {
    useEffect(() => {
      if (text.length === 0) channel.endTyping();
      else channel.startTyping();
    }, [text]);
  }
};

const useTextClearOnDisabled = (setText: (val: string) => void, chatDisabled: boolean) => {
  useEffect(() => {
    if (chatDisabled) setText('');
  }, [chatDisabled]);
};

const useAutoFocusOnEditMode = (
  textInputRef: React.MutableRefObject<TextInput | undefined>,
  messageToEdit?: SendbirdBaseMessage,
) => {
  useEffect(() => {
    if (messageToEdit?.isUserMessage()) {
      if (!AUTO_FOCUS) setTimeout(() => textInputRef.current?.focus(), 500);
    }
  }, [messageToEdit]);
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
  input: {
    flex: 1,
    marginRight: 4,
    borderRadius: 20,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 36,
    // Android - padding area is hidden
    // iOS - padding area is visible
    maxHeight: Platform.select({ ios: 36 * 2 + 16, android: 36 * 2 }),
  },
});

export default React.memo(ChannelInput);
