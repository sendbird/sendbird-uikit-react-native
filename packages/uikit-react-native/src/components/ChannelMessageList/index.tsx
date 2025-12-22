import React, { Ref } from 'react';
import { FlatList, FlatListProps, ListRenderItem, View } from 'react-native';

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
  useSafeAreaPadding,
} from '@sendbird/uikit-utils';

import type { UserProfileContextType } from '../../contexts/UserProfileCtx';
import {
  useLocalization,
  usePlatformService,
  useSBUHandlers,
  useSendbirdChat,
  useUserProfile,
} from '../../hooks/useContext';
import SBUUtils from '../../libs/SBUUtils';
import ChatFlatList from '../ChatFlatList';
import { ReactionAddons } from '../ReactionAddons';
import { UnreadMessagesFloatingProps } from '../UnreadMessagesFloating';

type PressActions = { onPress?: () => void; onLongPress?: () => void; bottomSheetItem?: BottomSheetItem };
type HandleableMessage = SendbirdUserMessage | SendbirdFileMessage;
type CreateMessagePressActions = (params: { message: SendbirdMessage }) => PressActions;
export type ChannelMessageListProps<T extends SendbirdGroupChannel | SendbirdOpenChannel> = {
  enableMessageGrouping: boolean;
  currentUserId?: string;
  channel: T;
  messages: SendbirdMessage[];
  newMessages: SendbirdMessage[];
  unreadFirstMessage?: SendbirdMessage;
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
  onReplyInThreadMessage?: (message: HandleableMessage) => void; // only available on group channel
  onDeleteMessage: (message: HandleableMessage) => Promise<void>;
  onResendFailedMessage: (failedMessage: HandleableMessage) => Promise<HandleableMessage | void>;
  onPressParentMessage?: (parentMessage: SendbirdMessage, childMessage: HandleableMessage) => void;
  onPressMediaMessage?: (message: SendbirdFileMessage, deleteMessage: () => Promise<void>, uri: string) => void;
  onPressMarkAsUnreadMessage?: (message: HandleableMessage) => void;

  renderMessage: (props: {
    focused: boolean;
    message: SendbirdMessage;
    prevMessage?: SendbirdMessage;
    nextMessage?: SendbirdMessage;
    onPress?: () => void;
    onLongPress?: () => void;
    onPressParentMessage?: ChannelMessageListProps<T>['onPressParentMessage'];
    onReplyInThreadMessage?: ChannelMessageListProps<T>['onReplyInThreadMessage'];
    onShowUserProfile?: UserProfileContextType['show'];
    channel: T;
    currentUserId?: ChannelMessageListProps<T>['currentUserId'];
    enableMessageGrouping: ChannelMessageListProps<T>['enableMessageGrouping'];
    bottomSheetItem?: BottomSheetItem;
    isFirstItem: boolean;
    isFirstUnreadMessage?: boolean;
    hideParentMessage?: boolean;
  }) => React.ReactElement | null;
  renderNewMessagesButton:
    | null
    | ((props: { visible: boolean; onPress: () => void; newMessages: SendbirdMessage[] }) => React.ReactElement | null);
  renderScrollToBottomButton: null | ((props: { visible: boolean; onPress: () => void }) => React.ReactElement | null);
  renderUnreadMessagesFloating?: null | ((props: UnreadMessagesFloatingProps) => React.ReactElement | null);
  unreadMessagesFloatingProps?: UnreadMessagesFloatingProps;
  flatListComponent?: React.ComponentType<FlatListProps<SendbirdMessage>>;
  flatListProps?: Omit<FlatListProps<SendbirdMessage>, 'data' | 'renderItem'>;
  onViewableItemsChanged?: FlatListProps<SendbirdMessage>['onViewableItemsChanged'];
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
    onReplyInThreadMessage,
    onDeleteMessage,
    onResendFailedMessage,
    onPressMediaMessage,
    onPressParentMessage,
    onPressMarkAsUnreadMessage,
    currentUserId,
    renderUnreadMessagesFloating,
    renderNewMessagesButton,
    renderScrollToBottomButton,
    renderMessage,
    messages,
    newMessages,
    unreadFirstMessage,
    enableMessageGrouping,
    onScrolledAwayFromBottom,
    scrolledAwayFromBottom,
    onBottomReached,
    onTopReached,
    flatListComponent,
    flatListProps,
    onViewableItemsChanged,
    onPressNewMessagesButton,
    onPressScrollToBottomButton,
    unreadMessagesFloatingProps,
  }: ChannelMessageListProps<T>,
  ref: React.ForwardedRef<FlatList<SendbirdMessage>>,
) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const { show } = useUserProfile();
  const safeAreaLayout = useSafeAreaPadding(['left', 'right']);
  const createMessagePressActions = useCreateMessagePressActions({
    channel,
    currentUserId,
    onEditMessage,
    onReplyMessage,
    onReplyInThreadMessage,
    onDeleteMessage,
    onResendFailedMessage,
    onPressMediaMessage,
    onPressMarkAsUnreadMessage,
  });

  const renderItem: ListRenderItem<SendbirdMessage> = useFreshCallback(({ item, index }) => {
    const { onPress, onLongPress, bottomSheetItem } = createMessagePressActions({ message: item });
    return renderMessage({
      message: item,
      prevMessage: messages[index + 1],
      nextMessage: messages[index - 1],
      isFirstUnreadMessage: unreadFirstMessage?.messageId === item.messageId,
      onPress,
      onLongPress,
      onPressParentMessage,
      onReplyInThreadMessage,
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
      {renderUnreadMessagesFloating && (
        <View
          style={[channel.isFrozen ? styles.unreadMsgFloatingWhenFrozen : styles.unreadMsgFloating, safeAreaLayout]}
        >
          {renderUnreadMessagesFloating({
            visible: unreadMessagesFloatingProps?.visible ?? false,
            onPressClose: () => unreadMessagesFloatingProps?.onPressClose(),
            unreadMessageCount: unreadMessagesFloatingProps?.unreadMessageCount ?? 0,
          })}
        </View>
      )}
      <ChatFlatList
        flatListComponent={flatListComponent}
        {...flatListProps}
        onViewableItemsChanged={onViewableItemsChanged}
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
  onReplyInThreadMessage,
  onDeleteMessage,
  onPressMediaMessage,
  onPressMarkAsUnreadMessage,
}: Pick<
  ChannelMessageListProps<T>,
  | 'channel'
  | 'currentUserId'
  | 'onEditMessage'
  | 'onReplyMessage'
  | 'onReplyInThreadMessage'
  | 'onDeleteMessage'
  | 'onResendFailedMessage'
  | 'onPressMediaMessage'
  | 'onPressMarkAsUnreadMessage'
>): CreateMessagePressActions => {
  const handlers = useSBUHandlers();
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
        handlers.onOpenFileURL?.(message.url);
      } else {
        const openFile = handlers.onOpenFileURL ?? SBUUtils.openURL;
        openFile(message.url);
      }
    }
  };

  const onMarkAsUnread = (message: HandleableMessage) => {
    onPressMarkAsUnreadMessage?.(message);
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
      markAsUnread: (message: HandleableMessage) => ({
        icon: 'mark-as-unread' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_MARK_AS_UNREAD,
        onPress: () => onMarkAsUnread(message),
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
      replyInThread: (message: HandleableMessage) => ({
        disabled: Boolean(message.parentMessageId),
        icon: 'thread' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_THREAD,
        onPress: () => onReplyInThreadMessage?.(message),
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
        if (message.sendingStatus === 'succeeded') {
          const isMyMsg = isMyMessage(message, currentUserId);
          if (isMyMsg) {
            sheetItems.push(menu.edit(message));
          }

          if (channel.isGroupChannel() && sbOptions.uikit.groupChannel.channel.enableMarkAsUnread) {
            sheetItems.push(menu.markAsUnread(message));
          }

          if (isMyMsg) {
            sheetItems.push(menu.delete(message));
          }
        }
        if (channel.isGroupChannel()) {
          if (sbOptions.uikit.groupChannel.channel.replyType === 'thread' && onReplyInThreadMessage !== undefined) {
            sheetItems.push(menu.replyInThread(message));
          } else if (sbOptions.uikit.groupChannel.channel.replyType === 'quote_reply') {
            sheetItems.push(menu.reply(message));
          }
        }
      }
    }

    if (message.isFileMessage()) {
      if (!isVoiceMessage(message)) {
        sheetItems.push(menu.download(message));
      }
      if (!channel.isEphemeral) {
        if (message.sendingStatus === 'succeeded') {
          if (channel.isGroupChannel() && sbOptions.uikit.groupChannel.channel.enableMarkAsUnread) {
            sheetItems.push(menu.markAsUnread(message));
          }

          if (isMyMessage(message, currentUserId)) {
            sheetItems.push(menu.delete(message));
          }
        }

        if (channel.isGroupChannel()) {
          if (sbOptions.uikit.groupChannel.channel.replyType === 'thread' && onReplyInThreadMessage !== undefined) {
            sheetItems.push(menu.replyInThread(message));
          } else if (sbOptions.uikit.groupChannel.channel.replyType === 'quote_reply') {
            sheetItems.push(menu.reply(message));
          }
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
    start: 8,
    end: 8,
  },
  frozenListPadding: {
    paddingBottom: 32,
  },
  unreadMsgFloating: {
    position: 'absolute',
    zIndex: 999,
    top: 12,
    alignSelf: 'center',
  },
  unreadMsgFloatingWhenFrozen: {
    position: 'absolute',
    zIndex: 999,
    top: 40,
    alignSelf: 'center',
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
    end: 16,
  },
});

// NOTE: Due to Generic inference is not working on forwardRef, we need to cast it properly for React 19 compatibility
export default React.forwardRef(ChannelMessageList) as <T extends SendbirdGroupChannel | SendbirdOpenChannel>(
  props: ChannelMessageListProps<T>,
) => React.ReactElement | null;
