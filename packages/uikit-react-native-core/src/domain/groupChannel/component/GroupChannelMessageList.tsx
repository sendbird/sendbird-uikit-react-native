import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Linking, ListRenderItem, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type Sendbird from 'sendbird';

import {
  ChannelFrozenBanner,
  createStyleSheet,
  useAlert,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { BottomSheetItem } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import {
  Logger,
  getAvailableUriFromFileMessage,
  getFileExtension,
  getFileType,
  isMyMessage,
  messageKeyExtractor,
} from '@sendbird/uikit-utils';

import type { ChatFlatListRef } from '../../../components/ChatFlatList';
import ChatFlatList from '../../../components/ChatFlatList';
import { useLocalization } from '../../../contexts/Localization';
import { usePlatformService } from '../../../contexts/PlatformService';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const HANDLE_NEXT_MSG_SEPARATELY = Platform.select({ android: true, ios: false });

const GroupChannelMessageList: React.FC<GroupChannelProps['MessageList']> = ({
  currentUserId,
  channel,
  messages,
  renderMessage,
  nextMessages,
  newMessagesFromNext,
  onBottomReached,
  onTopReached,
  NewMessagesTooltip,
  ScrollToBottomTooltip,
  onResendFailedMessage,
  onDeleteMessage,
  onPressImageMessage,
  flatListProps,
  enableMessageGrouping,
}) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const { left, right } = useSafeAreaInsets();
  const [scrollLeaveBottom, setScrollLeaveBottom] = useState(false);
  const scrollRef = useRef<ChatFlatListRef>(null);
  const [newMessages, setNewMessages] = useState(() => newMessagesFromNext);
  const getMessagePressActions = useGetMessagePressActions({
    onDeleteMessage,
    onPressImageMessage,
    currentUserId,
    onResendFailedMessage,
  });

  const safeAreaLayout = { paddingLeft: left, paddingRight: right };

  // NOTE: Cannot wrap with useCallback, because prevMessage (always getting from fresh messages)
  const renderItem: ListRenderItem<SendbirdMessage> = ({ item, index }) => {
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
  };

  if (!HANDLE_NEXT_MSG_SEPARATELY) {
    useEffect(() => {
      newMessagesFromNext.length !== 0 && setNewMessages((prev) => prev.concat(newMessagesFromNext));
      onBottomReached();
    }, [newMessagesFromNext]);
  }

  const onLeaveScrollBottom = useCallback((val: boolean) => {
    if (!HANDLE_NEXT_MSG_SEPARATELY) setNewMessages([]);
    setScrollLeaveBottom(val);
  }, []);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, safeAreaLayout]}>
      {channel.isFrozen && (
        <ChannelFrozenBanner style={styles.frozenBanner} text={STRINGS.GROUP_CHANNEL.LIST_BANNER_FROZEN} />
      )}
      <ChatFlatList
        nextMessages={nextMessages}
        onBottomReached={onBottomReached}
        onTopReached={onTopReached}
        onLeaveScrollBottom={onLeaveScrollBottom}
        currentUserId={currentUserId}
        {...flatListProps}
        listKey={`group-channel-messages-${channel.url}`}
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
      {NewMessagesTooltip && (
        <View style={[styles.newMsgTooltip, safeAreaLayout]}>
          <NewMessagesTooltip
            visible={scrollLeaveBottom}
            onPress={() => scrollRef.current?.scrollToBottom(false)}
            newMessages={HANDLE_NEXT_MSG_SEPARATELY ? newMessagesFromNext : newMessages}
          />
        </View>
      )}
      {ScrollToBottomTooltip && (
        <View pointerEvents={scrollLeaveBottom ? 'auto' : 'none'} style={[styles.scrollTooltip, safeAreaLayout]}>
          <ScrollToBottomTooltip visible={scrollLeaveBottom} onPress={() => scrollRef.current?.scrollToBottom(true)} />
        </View>
      )}
    </View>
  );
};

type HandleableMessage = Sendbird.UserMessage | Sendbird.FileMessage;
const toMegabyte = (byte: number) => byte / 1024 / 1024;
const useGetMessagePressActions = ({
  onPressImageMessage,
  onDeleteMessage,
  onResendFailedMessage,
  currentUserId,
}: Pick<
  GroupChannelProps['MessageList'],
  'onDeleteMessage' | 'onResendFailedMessage' | 'onPressImageMessage' | 'currentUserId'
>) => {
  const { colors } = useUIKitTheme();
  const { STRINGS } = useLocalization();
  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { alert } = useAlert();
  const { clipboardService, fileService } = usePlatformService();
  const { setEditMessage } = useContext(GroupChannelContexts.Fragment);

  const handleFailedMessage = (message: HandleableMessage) => {
    openSheet({
      sheetItems: [
        {
          title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_FAILED_RETRY,
          onPress: () =>
            onResendFailedMessage(message).catch(() => toast.show(STRINGS.TOAST.RESEND_MSG_ERROR, 'error')),
        },
        {
          title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_FAILED_REMOVE,
          titleColor: colors.ui.dialog.default.none.destructive,
          onPress: () => confirmDelete(message),
        },
      ],
    });
  };
  const confirmDelete = (message: HandleableMessage) => {
    alert({
      title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_TITLE,
      buttons: [
        {
          text: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL,
        },
        {
          text: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_OK,
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
        title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_COPY,
        onPress: () => {
          clipboardService.setString(msg.message || '');
          toast.show(STRINGS.TOAST.COPY_OK, 'success');
        },
      });

      if (isMyMessage(msg, currentUserId) && msg.sendingStatus === 'succeeded') {
        sheetItems.push(
          {
            icon: 'edit',
            title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_EDIT,
            onPress: () => setEditMessage(msg),
          },
          {
            icon: 'delete',
            title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_DELETE,
            onPress: () => confirmDelete(msg),
          },
        );
      }
    }

    if (msg.isFileMessage()) {
      sheetItems.push({
        icon: 'download',
        title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_SAVE,
        onPress: async () => {
          if (toMegabyte(msg.size) > 4) {
            toast.show(STRINGS.TOAST.DOWNLOAD_START, 'success');
          }

          fileService
            .save({ fileUrl: msg.url, fileName: msg.name })
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
          title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_DELETE,
          onPress: () => confirmDelete(msg),
        });
      }

      const ext = getFileExtension(msg.name);
      const fileType = getFileType(ext);
      if (fileType === 'image') {
        response.onPress = () => onPressImageMessage?.(msg, getAvailableUriFromFileMessage(msg));
      } else {
        response.onPress = () => Linking.openURL(msg.url);
      }
    }

    if (msg.sendingStatus === 'failed') {
      response.onPress = () => handleFailedMessage(msg);
    }

    if (sheetItems.length > 0) {
      response.onLongPress = () => openSheet({ sheetItems });
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
  newMsgTooltip: {
    position: 'absolute',
    zIndex: 999,
    bottom: 10,
    alignSelf: 'center',
  },
  scrollTooltip: {
    position: 'absolute',
    zIndex: 998,
    bottom: 10,
    right: 16,
  },
});

export default React.memo(GroupChannelMessageList);
