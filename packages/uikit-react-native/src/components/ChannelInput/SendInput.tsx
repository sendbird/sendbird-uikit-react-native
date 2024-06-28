import React, { forwardRef } from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';

import { MentionType, MessageMetaArray } from '@sendbird/chat/message';
import {
  Icon,
  Modal,
  TextInput,
  createStyleSheet,
  useAlert,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { Logger, useDeferredModalState, useIIFE } from '@sendbird/uikit-utils';

import { VOICE_MESSAGE_META_ARRAY_DURATION_KEY, VOICE_MESSAGE_META_ARRAY_MESSAGE_TYPE_KEY } from '../../constants';
import { useChannelInputItems } from '../../hooks/useChannelInputItems';
import { useLocalization, usePlatformService, useSendbirdChat } from '../../hooks/useContext';
import SBUUtils from '../../libs/SBUUtils';
import type { FileType } from '../../platform/types';
import type { MentionedUser } from '../../types';
import type { ChannelInputProps } from './index';

interface SendInputProps extends ChannelInputProps {
  text: string;
  onChangeText: (val: string) => void;
  onSelectionChange: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  mentionedUsers: MentionedUser[];
}

const SendInput = forwardRef<RNTextInput, SendInputProps>(function SendInput(
  {
    style,
    VoiceMessageInput,
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
    messageForThread,
  },
  ref,
) {
  const { playerService, recorderService } = usePlatformService();
  const { mentionManager, sbOptions } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { openSheet } = useBottomSheet();
  const toast = useToast();

  const {
    onClose,
    onDismiss,
    visible: voiceMessageInputVisible,
    setVisible: setVoiceMessageInputVisible,
  } = useDeferredModalState();

  const messageReplyParams = useIIFE(() => {
    const { groupChannel } = sbOptions.uikit;

    if (channel.isGroupChannel()) {
      if (groupChannel.channel.replyType === 'quote_reply' && messageToReply) {
        return {
          parentMessageId: messageToReply.messageId,
          isReplyToChannel: true,
        };
      } else if (groupChannel.channel.replyType === 'thread' && messageForThread) {
        return {
          parentMessageId: messageForThread.messageId,
          isReplyToChannel: true,
        };
      }
    }

    return {};
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

  const sendVoiceMessage = (file: FileType, durationMills: number) => {
    if (inputMuted) {
      toast.show(STRINGS.TOAST.USER_MUTED_ERROR, 'error');
      Logger.error(STRINGS.TOAST.USER_MUTED_ERROR);
    } else if (inputFrozen) {
      toast.show(STRINGS.TOAST.CHANNEL_FROZEN_ERROR, 'error');
      Logger.error(STRINGS.TOAST.CHANNEL_FROZEN_ERROR);
    } else {
      onPressSendFileMessage({
        file,
        metaArrays: [
          new MessageMetaArray({
            key: VOICE_MESSAGE_META_ARRAY_DURATION_KEY,
            value: [String(durationMills)],
          }),
          new MessageMetaArray({
            key: VOICE_MESSAGE_META_ARRAY_MESSAGE_TYPE_KEY,
            value: [`voice/${recorderService.options.extension}`],
          }),
        ],
        ...messageReplyParams,
      }).catch(onFailureToSend);
    }

    onChangeText('');
    setMessageToReply?.();
  };

  const sheetItems = useChannelInputItems(channel, sendFileMessage);

  const getPlaceholder = () => {
    if (inputMuted) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_MUTED;
    if (inputFrozen) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_DISABLED;
    if (inputDisabled) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_DISABLED;
    if (messageToReply) return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_REPLY;
    if (messageForThread) {
      if (messageForThread.threadInfo && messageForThread.threadInfo.replyCount > 0) {
        return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_REPLY_TO_THREAD;
      } else {
        return STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_REPLY_IN_THREAD;
      }
    }

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
        {AttachmentsButton && <AttachmentsButton onPress={() => openSheet({ sheetItems })} disabled={inputDisabled} />}
        <TextInput
          ref={ref}
          multiline
          disableFullscreenUI
          onSelectionChange={onSelectionChange}
          editable={!inputDisabled}
          onChangeText={onChangeText}
          style={style}
          placeholder={getPlaceholder()}
        >
          {mentionManager.textToMentionedComponents(
            text,
            mentionedUsers,
            sbOptions.uikit.groupChannel.channel.enableMention,
          )}
        </TextInput>

        {voiceMessageEnabled && (
          <VoiceMessageButton
            visible={!sendButtonVisible}
            disabled={inputDisabled}
            onPress={() => setVoiceMessageInputVisible(true)}
          />
        )}
        <UserMessageSendButton visible={sendButtonVisible} disabled={inputDisabled} onPress={sendUserMessage} />
        {voiceMessageEnabled && VoiceMessageInput && (
          <Modal
            disableBackgroundClose
            onClose={onClose}
            onDismiss={() => {
              onDismiss();
              Promise.allSettled([playerService.reset(), recorderService.reset()]);
            }}
            backgroundStyle={{ justifyContent: 'flex-end' }}
            visible={voiceMessageInputVisible}
            type={'slide-no-gesture'}
          >
            <VoiceMessageInput onClose={onClose} onSend={({ file, duration }) => sendVoiceMessage(file, duration)} />
          </Modal>
        )}
      </View>
    </View>
  );
});

type InputButtonProps = { visible: boolean; disabled: boolean; onPress: () => void };
const VoiceMessageButton = ({ visible, disabled, onPress }: InputButtonProps) => {
  const { STRINGS } = useLocalization();
  const { alert } = useAlert();
  const { playerService, recorderService } = usePlatformService();
  const { colors } = useUIKitTheme();
  if (!visible) return null;

  const onPressWithPermissionCheck = async () => {
    const recorderGranted = await recorderService.requestPermission();
    if (!recorderGranted) {
      alert({
        title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
        message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
          STRINGS.LABELS.PERMISSION_MICROPHONE,
          STRINGS.LABELS.PERMISSION_APP_NAME,
        ),
        buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
      });
      Logger.error('Failed to request permission for recorder');
      return;
    }

    const playerGranted = await playerService.requestPermission();
    if (!playerGranted) {
      alert({
        title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
        message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
          STRINGS.LABELS.PERMISSION_DEVICE_STORAGE,
          STRINGS.LABELS.PERMISSION_APP_NAME,
        ),
        buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
      });
      Logger.error('Failed to request permission for player');
      return;
    }

    onPress();
  };

  return (
    <TouchableOpacity onPress={onPressWithPermissionCheck} disabled={disabled}>
      <Icon
        color={disabled ? colors.ui.input.default.disabled.highlight : colors.ui.input.default.active.highlight}
        icon={'audio-on'}
        size={24}
        containerStyle={styles.sendIcon}
      />
    </TouchableOpacity>
  );
};
const UserMessageSendButton = ({ visible, disabled, onPress }: InputButtonProps) => {
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
  sendIcon: {
    marginLeft: 4,
    padding: 4,
  },
});

export default SendInput;
