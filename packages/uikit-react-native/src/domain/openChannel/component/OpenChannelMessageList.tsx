import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ListRenderItem, Platform, View } from 'react-native';

import type { BottomSheetItem } from '@sendbird/uikit-react-native-foundation';
import {
  ChannelFrozenBanner,
  createStyleSheet,
  useAlert,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdFileMessage, SendbirdMessage, SendbirdUserMessage } from '@sendbird/uikit-utils';
import {
  Logger,
  getAvailableUriFromFileMessage,
  getFileExtension,
  getFileType,
  isMyMessage,
  messageKeyExtractor,
  toMegabyte,
  useFreshCallback,
  useSafeAreaPadding,
} from '@sendbird/uikit-utils';

import type { ChatFlatListRef } from '../../../components/ChatFlatList';
import ChatFlatList from '../../../components/ChatFlatList';
import { useLocalization, usePlatformService } from '../../../hooks/useContext';
import SBUUtils from '../../../libs/SBUUtils';
import { OpenChannelContexts } from '../module/moduleContext';
import type { OpenChannelProps } from '../types';

const HANDLE_NEXT_MSG_SEPARATELY = Platform.select({ default: true });

const OpenChannelMessageList = ({
  currentUserId,
  channel,
  messages,
  renderMessage,
  nextMessages,
  newMessagesFromMembers,
  onBottomReached,
  onTopReached,
  renderNewMessagesButton,
  renderScrollToBottomButton,
  onResendFailedMessage,
  onDeleteMessage,
  onPressMediaMessage,
  flatListProps,
  enableMessageGrouping,
}: OpenChannelProps['MessageList']) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  const [scrollLeaveBottom, setScrollLeaveBottom] = useState(false);
  const [newMessagesInternalBuffer, setNewMessagesInternalBuffer] = useState(() => newMessagesFromMembers);

  const scrollRef = useRef<ChatFlatListRef>(null);

  const safeAreaLayout = useSafeAreaPadding(['left', 'right']);
  const getMessagePressActions = useGetMessagePressActions({
    channel,
    currentUserId,
    onDeleteMessage,
    onResendFailedMessage,
    onPressMediaMessage,
  });

  const renderItem: ListRenderItem<SendbirdMessage> = useFreshCallback(({ item, index }) => {
    const { onPress, onLongPress } = getMessagePressActions(item);
    return renderMessage({
      message: item,
      prevMessage: messages[index + 1],
      nextMessage: messages[index - 1],
      onPress,
      onLongPress,
      enableMessageGrouping,
      channel,
      currentUserId,
    });
  });

  if (!HANDLE_NEXT_MSG_SEPARATELY) {
    useEffect(() => {
      if (newMessagesInternalBuffer.length !== 0) {
        setNewMessagesInternalBuffer((prev) => prev.concat(newMessagesFromMembers));
      }
      onBottomReached();
    }, [newMessagesFromMembers]);
  }

  const onLeaveScrollBottom = useCallback((val: boolean) => {
    if (!HANDLE_NEXT_MSG_SEPARATELY) setNewMessagesInternalBuffer([]);
    setScrollLeaveBottom(val);
  }, []);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, safeAreaLayout]}>
      {channel.isFrozen && (
        <ChannelFrozenBanner style={styles.frozenBanner} text={STRINGS.OPEN_CHANNEL.LIST_BANNER_FROZEN} />
      )}
      <ChatFlatList
        nextMessages={nextMessages}
        onBottomReached={onBottomReached}
        onTopReached={onTopReached}
        onLeaveScrollBottom={onLeaveScrollBottom}
        currentUserId={currentUserId}
        {...flatListProps}
        ref={scrollRef}
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
            visible: scrollLeaveBottom,
            onPress: () => scrollRef.current?.scrollToBottom(false),
            newMessages: !HANDLE_NEXT_MSG_SEPARATELY ? newMessagesInternalBuffer : newMessagesFromMembers,
          })}
        </View>
      )}
      {renderScrollToBottomButton && (
        <View pointerEvents={scrollLeaveBottom ? 'auto' : 'none'} style={[styles.scrollButton, safeAreaLayout]}>
          {renderScrollToBottomButton({
            visible: scrollLeaveBottom,
            onPress: () => scrollRef.current?.scrollToBottom(false),
          })}
        </View>
      )}
    </View>
  );
};

type HandleableMessage = SendbirdUserMessage | SendbirdFileMessage;
const useGetMessagePressActions = ({
  currentUserId,
  onResendFailedMessage,
  onDeleteMessage,
  onPressMediaMessage,
}: Pick<
  OpenChannelProps['MessageList'],
  'channel' | 'currentUserId' | 'onResendFailedMessage' | 'onDeleteMessage' | 'onPressMediaMessage'
>) => {
  const { colors } = useUIKitTheme();
  const { STRINGS } = useLocalization();
  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { alert } = useAlert();
  const { clipboardService, fileService } = usePlatformService();
  const { setMessageToEdit } = useContext(OpenChannelContexts.Fragment);

  const handleFailedMessage = (message: HandleableMessage) => {
    openSheet({
      sheetItems: [
        {
          title: STRINGS.LABELS.CHANNEL_MESSAGE_FAILED_RETRY,
          onPress: () =>
            onResendFailedMessage(message).catch(() => toast.show(STRINGS.TOAST.RESEND_MSG_ERROR, 'error')),
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
          onPress: () => onDeleteMessage(message).catch(() => toast.show(STRINGS.TOAST.DELETE_MSG_ERROR, 'error')),
        },
      ],
    });
  };

  return (msg: SendbirdMessage) => {
    if (!msg.isUserMessage() && !msg.isFileMessage()) {
      return { onPress: undefined, onLongPress: undefined };
    }

    const sheetItems: BottomSheetItem['sheetItems'] = [];
    const response: { onPress?: () => void; onLongPress?: () => void } = {
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

      if (isMyMessage(msg, currentUserId) && msg.sendingStatus === 'succeeded') {
        sheetItems.push(
          {
            icon: 'edit',
            title: STRINGS.LABELS.CHANNEL_MESSAGE_EDIT,
            onPress: () => setMessageToEdit(msg),
          },
          {
            icon: 'delete',
            title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE,
            onPress: () => confirmDelete(msg),
          },
        );
      }
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

      if (isMyMessage(msg, currentUserId) && msg.sendingStatus === 'succeeded') {
        sheetItems.push({
          icon: 'delete',
          title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE,
          onPress: () => confirmDelete(msg),
        });
      }

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
        openSheet({ sheetItems });
      };
    }

    if (msg.sendingStatus === 'failed') {
      response.onLongPress = () => handleFailedMessage(msg);
      response.onPress = () => {
        onResendFailedMessage(msg).catch(() => toast.show(STRINGS.TOAST.RESEND_MSG_ERROR, 'error'));
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

export default React.memo(OpenChannelMessageList);
