import React, { Ref } from 'react';
import { FlatList, FlatListProps, ListRenderItem, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomSheetItem,
  ChannelFrozenBanner,
  createStyleSheet,
  useAlert,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {
  Logger,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdOpenChannel,
  SendbirdUserMessage,
  getAvailableUriFromFileMessage,
  getFileExtension,
  getFileType,
  isMyMessage,
  isVoiceMessage,
  messageKeyExtractor,
  shouldRenderReaction,
  toMegabyte,
  useFreshCallback,
} from '@sendbird/uikit-utils';

import type { UserProfileContextType } from '../../contexts/UserProfileCtx';
import { useLocalization, usePlatformService, useSendbirdChat, useUserProfile } from '../../hooks/useContext';
import SBUUtils from '../../libs/SBUUtils';
import ChatFlatList from '../ChatFlatList';
import { ReactionAddons } from '../ReactionAddons';

type PressActions = { onPress?: () => void; onLongPress?: () => void; bottomSheetItem?: BottomSheetItem };
type HandleableMessage = SendbirdUserMessage | SendbirdFileMessage;
type CreateMessagePressActions = (params: { message: SendbirdMessage }) => PressActions;
export type ChannelMessageListProps<T extends SendbirdGroupChannel | SendbirdOpenChannel> = {
  enableMessageGrouping: boolean;
  currentUserId?: string;
  channel: T;
  messages: SendbirdMessage[];
  newMessages: SendbirdMessage[];
  searchItem?: { startingPoint: number };

  scrolledAwayFromBottom: boolean;
  onScrolledAwayFromBottom: (value: boolean) => void;
  onTopReached: () => void;
  onBottomReached: () => void;
  hasNext: () => boolean;

  onPressNewMessagesButton: (animated?: boolean) => void;
  onPressScrollToBottomButton: (animated?: boolean) => void;

  onEditMessage: (message: HandleableMessage) => void;
  onReplyMessage?: (message: HandleableMessage) => void; // only available on group channel
  onDeleteMessage: (message: HandleableMessage) => Promise<void>;
  onResendFailedMessage: (failedMessage: HandleableMessage) => Promise<HandleableMessage | void>;
  onPressParentMessage?: (parentMessage: SendbirdMessage) => void;
  onPressMediaMessage?: (message: SendbirdFileMessage, deleteMessage: () => Promise<void>, uri: string) => void;

  renderMessage: (props: {
    focused: boolean;
    message: SendbirdMessage;
    prevMessage?: SendbirdMessage;
    nextMessage?: SendbirdMessage;
    onPress?: () => void;
    onLongPress?: () => void;
    onPressParentMessage?: ChannelMessageListProps<T>['onPressParentMessage'];
    onShowUserProfile?: UserProfileContextType['show'];
    channel: T;
    currentUserId?: ChannelMessageListProps<T>['currentUserId'];
    enableMessageGrouping: ChannelMessageListProps<T>['enableMessageGrouping'];
    bottomSheetItem?: BottomSheetItem;
    isFirstItem: boolean;
  }) => React.ReactElement | null;
  renderNewMessagesButton:
    | null
    | ((props: { visible: boolean; onPress: () => void; newMessages: SendbirdMessage[] }) => React.ReactElement | null);
  renderScrollToBottomButton: null | ((props: { visible: boolean; onPress: () => void }) => React.ReactElement | null);
  flatListProps?: Omit<FlatListProps<SendbirdMessage>, 'data' | 'renderItem'>;
} & {
  ref?: Ref<FlatList<SendbirdMessage>> | undefined;
};

const ChannelMessageList = <T extends SendbirdGroupChannel | SendbirdOpenChannel>(
  {
    searchItem,
    hasNext,
    channel,
    onEditMessage,
    onReplyMessage,
    onDeleteMessage,
    onResendFailedMessage,
    onPressMediaMessage,
    onPressParentMessage,
    currentUserId,
    renderNewMessagesButton,
    renderScrollToBottomButton,
    renderMessage,
    messages,
    newMessages,
    enableMessageGrouping,
    onScrolledAwayFromBottom,
    scrolledAwayFromBottom,
    onBottomReached,
    onTopReached,
    flatListProps,
    onPressNewMessagesButton,
    onPressScrollToBottomButton,
  }: ChannelMessageListProps<T>,
  ref: React.ForwardedRef<FlatList<SendbirdMessage>>,
) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const { show } = useUserProfile();
  const { left, right } = useSafeAreaInsets();
  const createMessagePressActions = useCreateMessagePressActions({
    channel,
    currentUserId,
    onEditMessage,
    onReplyMessage,
    onDeleteMessage,
    onResendFailedMessage,
    onPressMediaMessage,
  });

  const safeAreaLayout = { paddingLeft: left, paddingRight: right };

  const renderItem: ListRenderItem<SendbirdMessage> = useFreshCallback(({ item, index }) => {
    const { onPress, onLongPress, bottomSheetItem } = createMessagePressActions({ message: item });
    return renderMessage({
      message: item,
      prevMessage: messages[index + 1],
      nextMessage: messages[index - 1],
      onPress,
      onLongPress,
      onPressParentMessage,
      onShowUserProfile: show,
      enableMessageGrouping,
      channel,
      currentUserId,
      focused: (searchItem?.startingPoint ?? -1) === item.createdAt,
      bottomSheetItem,
      isFirstItem: index === 0,
    });
  });

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, safeAreaLayout]}>
      {channel.isFrozen && (
        <ChannelFrozenBanner style={styles.frozenBanner} text={STRINGS.LABELS.CHANNEL_MESSAGE_LIST_FROZEN} />
      )}
      <ChatFlatList
        {...flatListProps}
        onTopReached={onTopReached}
        onBottomReached={onBottomReached}
        onScrolledAwayFromBottom={onScrolledAwayFromBottom}
        ref={ref}
        data={messages}
        renderItem={renderItem}
        keyExtractor={messageKeyExtractor}
        contentContainerStyle={[
          // { minHeight: '100%', justifyContent: 'flex-end' },
          channel.isFrozen && styles.frozenListPadding,
          flatListProps?.contentContainerStyle,
        ]}
      />
      {renderNewMessagesButton && (
        <View style={[styles.newMsgButton, safeAreaLayout]}>
          {renderNewMessagesButton({
            visible: newMessages.length > 0 && (hasNext() || scrolledAwayFromBottom),
            onPress: () => onPressNewMessagesButton(),
            newMessages,
          })}
        </View>
      )}
      {renderScrollToBottomButton && (
        <View style={[styles.scrollButton, safeAreaLayout]}>
          {renderScrollToBottomButton({
            visible: hasNext() || scrolledAwayFromBottom,
            onPress: () => onPressScrollToBottomButton(),
          })}
        </View>
      )}
    </View>
  );
};

const useCreateMessagePressActions = <T extends SendbirdGroupChannel | SendbirdOpenChannel>({
  channel,
  currentUserId,
  onResendFailedMessage,
  onEditMessage,
  onReplyMessage,
  onDeleteMessage,
  onPressMediaMessage,
}: Pick<
  ChannelMessageListProps<T>,
  | 'channel'
  | 'currentUserId'
  | 'onEditMessage'
  | 'onReplyMessage'
  | 'onDeleteMessage'
  | 'onResendFailedMessage'
  | 'onPressMediaMessage'
>): CreateMessagePressActions => {
  const { colors } = useUIKitTheme();
  const { STRINGS } = useLocalization();
  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { alert } = useAlert();
  const { clipboardService, fileService } = usePlatformService();
  const { sbOptions } = useSendbirdChat();

  const onResendFailure = (error: Error) => {
    toast.show(STRINGS.TOAST.RESEND_MSG_ERROR, 'error');
    Logger.error(STRINGS.TOAST.RESEND_MSG_ERROR, error);
  };

  const onDeleteFailure = (error: Error) => {
    toast.show(STRINGS.TOAST.DELETE_MSG_ERROR, 'error');
    Logger.error(STRINGS.TOAST.DELETE_MSG_ERROR, error);
  };

  const onCopyText = (message: HandleableMessage) => {
    if (message.isUserMessage()) {
      clipboardService.setString(message.message || '');
      toast.show(STRINGS.TOAST.COPY_OK, 'success');
    }
  };

  const onDownloadFile = (message: HandleableMessage) => {
    if (message.isFileMessage()) {
      if (toMegabyte(message.size) > 4) {
        toast.show(STRINGS.TOAST.DOWNLOAD_START, 'success');
      }

      fileService
        .save({ fileUrl: message.url, fileName: message.name, fileType: message.type })
        .then((response) => {
          toast.show(STRINGS.TOAST.DOWNLOAD_OK, 'success');
          Logger.log('File saved to', response);
        })
        .catch((err) => {
          toast.show(STRINGS.TOAST.DOWNLOAD_ERROR, 'error');
          Logger.log('File save failure', err);
        });
    }
  };

  const onOpenFile = (message: HandleableMessage) => {
    if (message.isFileMessage()) {
      const fileType = getFileType(message.type || getFileExtension(message.name));
      if (['image', 'video', 'audio'].includes(fileType)) {
        onPressMediaMessage?.(message, () => onDeleteMessage(message), getAvailableUriFromFileMessage(message));
      } else {
        SBUUtils.openURL(message.url);
      }
    }
  };

  const openSheetForFailedMessage = (message: HandleableMessage) => {
    openSheet({
      sheetItems: [
        {
          title: STRINGS.LABELS.CHANNEL_MESSAGE_FAILED_RETRY,
          onPress: () => onResendFailedMessage(message).catch(onResendFailure),
        },
        {
          title: STRINGS.LABELS.CHANNEL_MESSAGE_FAILED_REMOVE,
          titleColor: colors.ui.dialog.default.none.destructive,
          onPress: () => alertForMessageDelete(message),
        },
      ],
    });
  };

  const alertForMessageDelete = (message: HandleableMessage) => {
    alert({
      title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE,
      buttons: [
        { text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL },
        {
          text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_OK,
          style: 'destructive',
          onPress: () => {
            onDeleteMessage(message).catch(onDeleteFailure);
          },
        },
      ],
    });
  };

  return ({ message }) => {
    if (!message.isUserMessage() && !message.isFileMessage()) return {};

    const sheetItems: BottomSheetItem['sheetItems'] = [];
    const menu = {
      copy: (message: HandleableMessage) => ({
        icon: 'copy' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_COPY,
        onPress: () => onCopyText(message),
      }),
      edit: (message: HandleableMessage) => ({
        icon: 'edit' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_EDIT,
        onPress: () => onEditMessage(message),
      }),
      delete: (message: HandleableMessage) => ({
        disabled: message.threadInfo ? message.threadInfo.replyCount > 0 : undefined,
        icon: 'delete' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE,
        onPress: () => alertForMessageDelete(message),
      }),
      reply: (message: HandleableMessage) => ({
        disabled: Boolean(message.parentMessageId),
        icon: 'reply' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_REPLY,
        onPress: () => onReplyMessage?.(message),
      }),
      download: (message: HandleableMessage) => ({
        icon: 'download' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_SAVE,
        onPress: () => onDownloadFile(message),
      }),
    };

    if (message.isUserMessage()) {
      sheetItems.push(menu.copy(message));
      if (!channel.isEphemeral) {
        if (isMyMessage(message, currentUserId) && message.sendingStatus === 'succeeded') {
          sheetItems.push(menu.edit(message));
          sheetItems.push(menu.delete(message));
        }
        if (channel.isGroupChannel() && sbOptions.uikit.groupChannel.channel.replyType === 'quote_reply') {
          sheetItems.push(menu.reply(message));
        }
      }
    }

    if (message.isFileMessage()) {
      if (!isVoiceMessage(message)) {
        sheetItems.push(menu.download(message));
      }
      if (!channel.isEphemeral) {
        if (isMyMessage(message, currentUserId) && message.sendingStatus === 'succeeded') {
          sheetItems.push(menu.delete(message));
        }
        if (channel.isGroupChannel() && sbOptions.uikit.groupChannel.channel.replyType === 'quote_reply') {
          sheetItems.push(menu.reply(message));
        }
      }
    }

    const configs = sbOptions.uikitWithAppInfo.groupChannel.channel;
    const bottomSheetItem: BottomSheetItem = {
      sheetItems,
      HeaderComponent: shouldRenderReaction(
        channel,
        channel.isGroupChannel() && (channel.isSuper ? configs.enableReactionsSupergroup : configs.enableReactions),
      )
        ? ({ onClose }) => <ReactionAddons.BottomSheet message={message} channel={channel} onClose={onClose} />
        : undefined,
    };

    switch (true) {
      case message.sendingStatus === 'pending': {
        return {
          onPress: undefined,
          onLongPress: undefined,
          bottomSheetItem: undefined,
        };
      }

      case message.sendingStatus === 'failed': {
        return {
          onPress: () => onResendFailedMessage(message).catch(onResendFailure),
          onLongPress: () => openSheetForFailedMessage(message),
          bottomSheetItem,
        };
      }

      case message.isFileMessage(): {
        return {
          onPress: () => onOpenFile(message),
          onLongPress: () => openSheet(bottomSheetItem),
          bottomSheetItem,
        };
      }

      default: {
        return {
          onPress: undefined,
          onLongPress: () => openSheet(bottomSheetItem),
          bottomSheetItem,
        };
      }
    }
  };
};

const styles = createStyleSheet({
  frozenBanner: {
    position: 'absolute',
    zIndex: 999,
    top: 8,
    left: 8,
    right: 8,
  },
  frozenListPadding: {
    paddingBottom: 32,
  },
  newMsgButton: {
    position: 'absolute',
    zIndex: 999,
    bottom: 10,
    alignSelf: 'center',
  },
  scrollButton: {
    position: 'absolute',
    zIndex: 998,
    bottom: 10,
    right: 16,
  },
});

// NOTE: Due to Generic inference is not working on forwardRef, we need to cast it as typeof ChannelMessageList and implicit `ref` prop
export default React.forwardRef(ChannelMessageList) as typeof ChannelMessageList;
