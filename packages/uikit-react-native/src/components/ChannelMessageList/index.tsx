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
} from '@gathertown/uikit-react-native-foundation';
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
  messageKeyExtractor,
  shouldRenderReaction,
  toMegabyte,
  useFreshCallback,
} from '@gathertown/uikit-utils';

import type { UserProfileContextType } from '../../contexts/UserProfileCtx';
import { useLocalization, usePlatformService, useSendbirdChat, useUserProfile } from '../../hooks/useContext';
import SBUUtils from '../../libs/SBUUtils';
import type { CommonComponent } from '../../types';
import ChatFlatList from '../ChatFlatList';
import { ReactionAddons } from '../ReactionAddons';

type PressActions = { onPress?: () => void; onLongPress?: () => void };
type HandleableMessage = SendbirdUserMessage | SendbirdFileMessage;
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
  onResendFailedMessage: (failedMessage: HandleableMessage) => Promise<void>;
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
  }) => React.ReactElement | null;
  renderNewMessagesButton: null | CommonComponent<{
    visible: boolean;
    onPress: () => void;
    newMessages: SendbirdMessage[];
  }>;
  renderScrollToBottomButton: null | CommonComponent<{
    visible: boolean;
    onPress: () => void;
  }>;
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
  const getMessagePressActions = useGetMessagePressActions({
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
    const { onPress, onLongPress } = getMessagePressActions(item);
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

const useGetMessagePressActions = <T extends SendbirdGroupChannel | SendbirdOpenChannel>({
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
>) => {
  const { colors } = useUIKitTheme();
  const { STRINGS } = useLocalization();
  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { alert } = useAlert();
  const { clipboardService, fileService } = usePlatformService();
  const { sbOptions } = useSendbirdChat();

  const onFailureToReSend = (error: Error) => {
    toast.show(STRINGS.TOAST.RESEND_MSG_ERROR, 'error');
    Logger.error(STRINGS.TOAST.RESEND_MSG_ERROR, error);
  };

  const handleFailedMessage = (message: HandleableMessage) => {
    openSheet({
      sheetItems: [
        {
          title: STRINGS.LABELS.CHANNEL_MESSAGE_FAILED_RETRY,
          onPress: () => {
            onResendFailedMessage(message).catch(onFailureToReSend);
          },
        },
        {
          title: STRINGS.LABELS.CHANNEL_MESSAGE_FAILED_REMOVE,
          titleColor: colors.ui.dialog.default.none.destructive,
          onPress: () => confirmDelete(message),
        },
      ],
    });
  };
  const confirmDelete = (message: HandleableMessage) => {
    alert({
      title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE,
      buttons: [
        {
          text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL,
        },
        {
          text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_OK,
          style: 'destructive',
          onPress: () => {
            onDeleteMessage(message).catch(() => toast.show(STRINGS.TOAST.DELETE_MSG_ERROR, 'error'));
          },
        },
      ],
    });
  };

  return (msg: SendbirdMessage) => {
    if (!msg.isUserMessage() && !msg.isFileMessage()) {
      return { onPress: undefined, onLongPress: undefined };
    }

    const sheetItems: BottomSheetItem['sheetItems'] = [];
    const response: PressActions = {
      onPress: undefined,
      onLongPress: undefined,
    };

    if (msg.isUserMessage()) {
      sheetItems.push({
        icon: 'copy',
        title: STRINGS.LABELS.CHANNEL_MESSAGE_COPY,
        onPress: () => {
          clipboardService.setString(msg.message || '');
          toast.show(STRINGS.TOAST.COPY_OK, 'success');
        },
      });
    }
    if (msg.isFileMessage()) {
      sheetItems.push({
        icon: 'download',
        title: STRINGS.LABELS.CHANNEL_MESSAGE_SAVE,
        onPress: async () => {
          if (toMegabyte(msg.size) > 4) {
            toast.show(STRINGS.TOAST.DOWNLOAD_START, 'success');
          }

          fileService
            .save({ fileUrl: msg.url, fileName: msg.name, fileType: msg.type })
            .then((response) => {
              toast.show(STRINGS.TOAST.DOWNLOAD_OK, 'success');
              Logger.log('File saved to', response);
            })
            .catch((err) => {
              toast.show(STRINGS.TOAST.DOWNLOAD_ERROR, 'error');
              Logger.log('File save failure', err);
            });
        },
      });
    }
    if (!channel.isEphemeral) {
      if (isMyMessage(msg, currentUserId) && msg.sendingStatus === 'succeeded') {
        if (msg.isUserMessage()) {
          sheetItems.push({
            icon: 'edit',
            title: STRINGS.LABELS.CHANNEL_MESSAGE_EDIT,
            onPress: () => onEditMessage(msg),
          });
        }
        sheetItems.push({
          disabled: msg.threadInfo ? msg.threadInfo.replyCount > 0 : undefined,
          icon: 'delete',
          title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE,
          onPress: () => confirmDelete(msg),
        });
      }
      if (channel.isGroupChannel() && sbOptions.uikit.groupChannel.channel.replyType === 'quote_reply') {
        sheetItems.push({
          disabled: Boolean(msg.parentMessageId),
          icon: 'reply',
          title: STRINGS.LABELS.CHANNEL_MESSAGE_REPLY,
          onPress: () => onReplyMessage?.(msg),
        });
      }
    }

    if (msg.isFileMessage()) {
      const fileType = getFileType(msg.type || getFileExtension(msg.name));
      switch (fileType) {
        case 'image':
        case 'video':
        case 'audio': {
          response.onPress = () => {
            onPressMediaMessage?.(msg, () => onDeleteMessage(msg), getAvailableUriFromFileMessage(msg));
          };
          break;
        }
        default: {
          response.onPress = () => SBUUtils.openURL(msg.url);
          break;
        }
      }
    }

    if (sheetItems.length > 0) {
      response.onLongPress = () => {
        openSheet({
          sheetItems,
          HeaderComponent: shouldRenderReaction(
            channel,
            sbOptions.uikitWithAppInfo.groupChannel.channel.enableReactions,
          )
            ? ({ onClose }) => <ReactionAddons.BottomSheet message={msg} channel={channel} onClose={onClose} />
            : undefined,
        });
      };
    }

    if (msg.sendingStatus === 'failed') {
      response.onLongPress = () => handleFailedMessage(msg);
      response.onPress = () => {
        onResendFailedMessage(msg).catch(onFailureToReSend);
      };
    }

    if (msg.sendingStatus === 'pending') {
      response.onLongPress = undefined;
      response.onPress = undefined;
    }

    return response;
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
