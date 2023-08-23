import React, { forwardRef } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';

import { MentionType } from '@sendbird/chat/message';
import {
  Icon,
  TextInput,
  createStyleSheet,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { Logger, useIIFE } from '@sendbird/uikit-utils';

import { useLocalization, useSendbirdChat } from '../../hooks/useContext';
import type { FileType } from '../../platform/types';
import type { MentionedUser } from '../../types';
import type { ChannelInputProps } from './index';
import { useChannelInputItems } from './useChannelInputItems';

interface SendInputProps extends ChannelInputProps {
  text: string;
  onChangeText: (val: string) => void;
  onSelectionChange: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  mentionedUsers: MentionedUser[];
}

const SendInput = forwardRef<RNTextInput, SendInputProps>(function SendInput(
  {
    MessageToReplyPreview,
    AttachmentsButton,
    onPressSendUserMessage,
    onPressSendFileMessage,
    text,
    onChangeText,
    onSelectionChange,
    mentionedUsers,
    inputDisabled,
    inputFrozen,
    inputMuted,
    channel,
    messageToReply,
    setMessageToReply,
  },
  ref,
) {
  const { mentionManager, sbOptions } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { openSheet } = useBottomSheet();
  const toast = useToast();

  const messageReplyParams = useIIFE(() => {
    const { groupChannel } = sbOptions.uikit;
    if (!channel.isGroupChannel() || groupChannel.channel.replyType === 'none' || !messageToReply) return {};
    return {
      parentMessageId: messageToReply.messageId,
      isReplyToChannel: true,
    };
  });

  const messageMentionParams = useIIFE(() => {
    const { groupChannel } = sbOptions.uikit;
    if (!channel.isGroupChannel() || !groupChannel.channel.enableMention) return {};
    return {
      mentionType: MentionType.USERS,
      mentionedUserIds: mentionedUsers.map((it) => it.user.userId),
      mentionedMessageTemplate: mentionManager.textToMentionedMessageTemplate(
        text,
        mentionedUsers,
        groupChannel.channel.enableMention,
      ),
    };
  });

  const onFailureToSend = (error: Error) => {
    toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error');
    Logger.error(STRINGS.TOAST.SEND_MSG_ERROR, error);
  };

  const sendUserMessage = () => {
    onPressSendUserMessage({
      message: text,
      ...messageMentionParams,
      ...messageReplyParams,
    }).catch(onFailureToSend);

    onChangeText('');
    setMessageToReply?.();
  };

  const sendFileMessage = (file: FileType) => {
    onPressSendFileMessage({
      file,
      ...messageReplyParams,
    }).catch(onFailureToSend);

    setMessageToReply?.();
  };

  const sheetItems = useChannelInputItems(channel, sendFileMessage);
  const onPressAttachment = () => openSheet({ sheetItems });

  const getPlaceholder = () => {
    if (inputMuted) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_MUTED;
    if (inputFrozen) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_DISABLED;
    if (inputDisabled) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_DISABLED;
    if (messageToReply) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_REPLY;

    return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_ACTIVE;
  };

  const voiceMessageEnabled = channel.isGroupChannel() && sbOptions.uikit.groupChannel.channel.enableVoiceMessage;
  const sendButtonVisible = Boolean(text.trim());

  return (
    <View>
      {MessageToReplyPreview && (
        <MessageToReplyPreview messageToReply={messageToReply} setMessageToReply={setMessageToReply} />
      )}
      <View style={styles.sendInputContainer}>
        {AttachmentsButton && <AttachmentsButton onPress={onPressAttachment} disabled={inputDisabled} />}
        <TextInput
          ref={ref}
          multiline
          disableFullscreenUI
          onSelectionChange={onSelectionChange}
          editable={!inputDisabled}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={getPlaceholder()}
        >
          {mentionManager.textToMentionedComponents(
            text,
            mentionedUsers,
            sbOptions.uikit.groupChannel.channel.enableMention,
          )}
        </TextInput>

        {voiceMessageEnabled && (
          <VoiceMessageSendButton visible={!sendButtonVisible} disabled={inputDisabled} onPress={() => {}} />
        )}
        <MessageSendButton visible={sendButtonVisible} disabled={inputDisabled} onPress={sendUserMessage} />
      </View>
    </View>
  );
});

type SendButtonProps = { visible: boolean; disabled: boolean; onPress: () => void };
const VoiceMessageSendButton = ({ visible, disabled, onPress }: SendButtonProps) => {
  const { colors } = useUIKitTheme();
  if (!visible) return null;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Icon
        color={disabled ? colors.ui.input.default.disabled.highlight : colors.ui.input.default.active.highlight}
        icon={'audio-on'}
        size={24}
        containerStyle={styles.sendIcon}
      />
    </TouchableOpacity>
  );
};
const MessageSendButton = ({ visible, disabled, onPress }: SendButtonProps) => {
  const { colors } = useUIKitTheme();
  if (!visible) return null;
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Icon
        color={disabled ? colors.ui.input.default.disabled.highlight : colors.ui.input.default.active.highlight}
        icon={'send'}
        size={24}
        containerStyle={styles.sendIcon}
      />
    </TouchableOpacity>
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
  sendIcon: {
    marginLeft: 4,
    padding: 4,
  },
});

export default SendInput;
