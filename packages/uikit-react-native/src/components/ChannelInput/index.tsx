import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import {
  Logger,
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
  useSafeAreaPadding,
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
  /**
   * Whether to show user id information on each item.
   * */
  showUserId?: boolean;
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

  // TextInput props - only safe properties that don't interfere with UIKit functionality
  partialTextInputProps?: Partial<Pick<TextInputProps, 'autoCorrect'>>;
};

const AUTO_FOCUS = Platform.select({ ios: false, android: true, default: false });
const isAndroidApi35Plus = Platform.OS === 'android' && Platform.Version >= 35;
const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({
  ios: 'padding' as const,
  android: isAndroidApi35Plus ? ('padding' as const) : undefined,
  default: undefined,
});

// FIXME(iOS): Dynamic style does not work properly when typing the CJK. (https://github.com/facebook/react-native/issues/26107)
//  To workaround temporarily, change the key for re-mount the component.
//  -> This will affect to keyboard blur when add/remove first mentioned user.
// const GET_INPUT_KEY = (shouldReset: boolean) => {
//   return Platform.OS === 'ios' && shouldReset ? 'uikit-input-clear' : 'uikit-input';
// };

// TODO: Refactor 'Edit' mode to clearly
const ChannelInput = (props: ChannelInputProps) => {
  const { channel, keyboardAvoidOffset, messageToEdit, setMessageToEdit } = props;

  const safeArea = useSafeAreaPadding(['top', 'left', 'right', 'bottom']);

  // Android API 35+ keyboard avoidance handling
  /**
   * Android API 35+ introduced edge-to-edge layouts, which changed how keyboard avoidance should be handled.
   * For API 35+, the system manages insets automatically, so we use the provided keyboardAvoidOffset directly.
   * For older Android versions, we manually subtract the safe area bottom padding to avoid overlapping with system UI.
   * See: https://developer.android.com/develop/ui/views/layout/edge-to-edge
   */
  const keyboardVerticalOffset = isAndroidApi35Plus
    ? keyboardAvoidOffset
    : -safeArea.paddingBottom + keyboardAvoidOffset;
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
  const inputKeyToRemount = 'input'; //GET_INPUT_KEY(mentionAvailable ? mentionedUsers.length === 0 : false);

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

  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const keyboardDidShow = () => setKeyboardShown(true);
    const keyboardDidHide = () => setKeyboardShown(false);

    const showSubscription = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const shouldShowSafeAreaBottom = !isAndroidApi35Plus || (isAndroidApi35Plus && !keyboardShown);

  if (!props.shouldRenderInput) {
    return <SafeAreaBottom height={safeArea.paddingBottom} />;
  }

  return (
    <>
      <KeyboardAvoidingView keyboardVerticalOffset={keyboardVerticalOffset} behavior={KEYBOARD_AVOID_VIEW_BEHAVIOR}>
        <View
          style={{
            paddingStart: safeArea.paddingStart,
            paddingEnd: safeArea.paddingEnd,
            backgroundColor: colors.background,
          }}
        >
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
          {shouldShowSafeAreaBottom && <SafeAreaBottom height={safeArea.paddingBottom} />}
        </View>
      </KeyboardAvoidingView>
      {mentionAvailable && props.SuggestedMentionList && (
        <props.SuggestedMentionList
          text={text}
          selection={selection}
          inputHeight={inputHeight}
          topInset={safeArea.paddingTop}
          bottomInset={safeArea.paddingBottom}
          onPressToMention={onPressToMention}
          mentionedUsers={mentionedUsers}
        />
      )}
    </>
  );
};

const useTypingTrigger = (text: string, channel: SendbirdBaseChannel) => {
  useEffect(
    () => {
      function triggerTyping() {
        if (channel.isGroupChannel()) {
          const action = () => (text.length === 0 ? channel.endTyping() : channel.startTyping());
          action().catch((error) => {
            Logger.debug('ChannelInput: Failed to trigger typing', error);
          });
        }
      }

      triggerTyping();
    },
    channel.isGroupChannel() ? [text] : [],
  );
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
    marginEnd: 4,
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
