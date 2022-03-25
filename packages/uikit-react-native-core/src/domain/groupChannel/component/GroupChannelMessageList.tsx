import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ListRenderItem, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type Sendbird from 'sendbird';

import {
  ChannelFrozenBanner,
  createStyleSheet,
  useAlert,
  useBottomSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { BottomSheetItem } from '@sendbird/uikit-react-native-foundation/src/ui/BottomSheet';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import {
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
import { GroupChannelContext } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const HANDLE_NEXT_MSG_SEPARATELY = Platform.select({ android: true, ios: false });
type HandleableMessage = Sendbird.UserMessage | Sendbird.FileMessage;

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
}) => {
  const { setEditMessage } = useContext(GroupChannelContext.Fragment);
  const { LABEL } = useLocalization();
  const { colors } = useUIKitTheme();
  const { left, right } = useSafeAreaInsets();
  const [scrollLeaveBottom, setScrollLeaveBottom] = useState(false);
  const scrollRef = useRef<ChatFlatListRef>(null);
  const [newMessages, setNewMessages] = useState(() => newMessagesFromNext);

  const safeAreaLayout = { paddingLeft: left, paddingRight: right };

  const { openSheet } = useBottomSheet();
  const { alert } = useAlert();
  const { clipboardService, fileSystemService } = usePlatformService();

  const handleFailedMessage = (message: HandleableMessage) => {
    openSheet({
      sheetItems: [
        {
          title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_FAILED_RETRY,
          onPress: () => onResendFailedMessage(message),
        },
        {
          title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_FAILED_REMOVE,
          titleColor: colors.ui.dialog.default.none.destructive,
          onPress: () => confirmDelete(message),
        },
      ],
    });
  };
  const confirmDelete = (message: HandleableMessage) => {
    alert({
      title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_DELETE_CONFIRM_TITLE,
      buttons: [
        {
          text: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL,
        },
        {
          text: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_DELETE_CONFIRM_OK,
          style: 'destructive',
          onPress: () => onDeleteMessage(message),
        },
      ],
    });
  };

  const getMessagePress = (msg: SendbirdMessage) => {
    if (msg.isUserMessage()) {
      if (msg.sendingStatus === 'failed') {
        return {
          onPress: () => handleFailedMessage(msg),
          onLongPress: undefined,
        };
      }

      const sheetItems: BottomSheetItem['sheetItems'] = [
        {
          icon: 'copy',
          title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_COPY,
          onPress: () => clipboardService.setString(msg.message || ''),
        },
      ];
      if (isMyMessage(msg, currentUserId)) {
        sheetItems.push(
          {
            icon: 'edit',
            title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_EDIT,
            onPress: () => setEditMessage(msg),
          },
          {
            icon: 'delete',
            title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_DELETE,
            onPress: () => confirmDelete(msg),
          },
        );
      }

      return {
        onPress: undefined,
        onLongPress: () => openSheet({ sheetItems }),
      };
    }

    if (msg.isFileMessage()) {
      if (msg.sendingStatus === 'failed') {
        return {
          onPress: () => handleFailedMessage(msg),
          onLongPress: undefined,
        };
      }

      const sheetItems: BottomSheetItem['sheetItems'] = [
        {
          icon: 'download',
          title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_COPY,
          onPress: () => fileSystemService.download(msg.url, 'DownloadFolder'),
        },
      ];
      if (isMyMessage(msg, currentUserId)) {
        sheetItems.push({
          icon: 'delete',
          title: LABEL.GROUP_CHANNEL.FRAGMENT.DIALOG_MESSAGE_DELETE,
          onPress: () => confirmDelete(msg),
        });
      }

      const ext = getFileExtension(msg.name);
      const fileType = getFileType(ext);

      return {
        // if image open modal
        onPress: fileType === 'image' ? () => onPressImageMessage(msg, getAvailableUriFromFileMessage(msg)) : undefined,
        onLongPress: () => openSheet({ sheetItems }),
      };
    }

    return { onPress: undefined, onLongPress: undefined };
  };

  // NOTE: Cannot wrap with useCallback, because prevMessage (always getting from fresh messages)
  const renderItem: ListRenderItem<SendbirdMessage> = ({ item, index }) => {
    const { onPress, onLongPress } = getMessagePress(item);
    return renderMessage(item, messages[index + 1], messages[index - 1], onPress, onLongPress);
  };

  useEffect(() => {
    if (HANDLE_NEXT_MSG_SEPARATELY) return;
    newMessagesFromNext.length !== 0 && setNewMessages((prev) => prev.concat(newMessagesFromNext));
    onBottomReached();
  }, [newMessagesFromNext]);

  const onLeaveScrollBottom = useCallback((val: boolean) => {
    if (!HANDLE_NEXT_MSG_SEPARATELY) setNewMessages([]);
    setScrollLeaveBottom(val);
  }, []);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, safeAreaLayout]}>
      {channel.isFrozen && (
        <ChannelFrozenBanner style={styles.frozenBanner} text={LABEL.GROUP_CHANNEL.FRAGMENT.LIST_BANNER_FROZEN} />
      )}
      <ChatFlatList
        listKey={`group-channel-messages-${channel.url}`}
        ref={scrollRef}
        data={messages}
        nextMessages={nextMessages}
        renderItem={renderItem}
        keyExtractor={messageKeyExtractor}
        onBottomReached={onBottomReached}
        onTopReached={onTopReached}
        contentContainerStyle={channel.isFrozen && styles.frozenListPadding}
        onLeaveScrollBottom={onLeaveScrollBottom}
        currentUserId={currentUserId}
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

export default GroupChannelMessageList;
