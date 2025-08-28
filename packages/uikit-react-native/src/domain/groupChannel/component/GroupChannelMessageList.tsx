import type { ViewToken } from '@react-native/virtualized-lists';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useToast } from '@sendbird/uikit-react-native-foundation';
import { useGroupChannelHandler } from '@sendbird/uikit-tools';
import {
  SendbirdMessage,
  SendbirdSendableMessage,
  confirmAndMarkAsRead,
  isDifferentChannel,
  useFreshCallback,
  useIsFirstMount,
} from '@sendbird/uikit-utils';

import ChannelMessageList from '../../../components/ChannelMessageList';
import { UnreadMessagesFloatingProps } from '../../../components/UnreadMessagesFloating';
import { MESSAGE_FOCUS_ANIMATION_DELAY, MESSAGE_SEARCH_SAFE_SCROLL_DELAY } from '../../../constants';
import { GroupChannelFragmentOptionsPubSubContextPayload } from '../../../contexts/SendbirdChatCtx';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelMessageList = (props: GroupChannelProps['MessageList']) => {
  const toast = useToast();
  const { STRINGS } = useLocalization();
  const { sdk, sbOptions, groupChannelFragmentOptions } = useSendbirdChat();
  const { setMessageToEdit, setMessageToReply } = useContext(GroupChannelContexts.Fragment);
  const groupChannelPubSub = useContext(GroupChannelContexts.PubSub);
  const { flatListRef, lazyScrollToBottom, lazyScrollToMessageId, onPressReplyMessageInThread } = useContext(
    GroupChannelContexts.MessageList,
  );

  const isFirstMount = useIsFirstMount();

  const hasSeenNewLineRef = useRef(false);
  const isNewLineInViewportRef = useRef(false);
  const isNewLineExistInChannelRef = useRef(false);
  const scrolledAwayFromBottomRef = useRef(false);
  const [isVisibleUnreadMessageFloating, setIsVisibleUnreadMessageFloating] = useState(false);
  const viewableMessages = useRef<SendbirdMessage[]>();
  const hasUserMarkedAsUnreadRef = useRef(false);
  const [unreadFirstMessage, setUnreadFirstMessage] = useState<SendbirdMessage | undefined>(undefined);
  const pendingBottomReachedRef = useRef<{ timeout: number; timestamp: number } | null>(null);

  const updateHasSeenNewLine = useCallback(
    (hasSeenNewLine: boolean) => {
      if (hasSeenNewLineRef.current !== hasSeenNewLine) {
        hasSeenNewLineRef.current = hasSeenNewLine;
        props.onNewLineSeenChange?.(hasSeenNewLine);
      }
    },
    [props.onNewLineSeenChange],
  );

  const updateHasUserMarkedAsUnread = useCallback(
    (hasUserMarkedAsUnread: boolean) => {
      if (hasUserMarkedAsUnreadRef.current !== hasUserMarkedAsUnread) {
        hasUserMarkedAsUnreadRef.current = hasUserMarkedAsUnread;
        props.onUserMarkedAsUnreadChange?.(hasUserMarkedAsUnread);
      }
    },
    [props.onUserMarkedAsUnreadChange],
  );

  const scrollToMessageWithCreatedAt = useFreshCallback(
    (createdAt: number, focusAnimated: boolean, timeout: number): boolean => {
      const foundMessage = props.messages.find((it) => it.createdAt === createdAt);
      const isIncludedInList = !!foundMessage;
      pendingBottomReachedRef.current = null;

      if (isIncludedInList) {
        if (focusAnimated) {
          setTimeout(() => props.onUpdateSearchItem({ startingPoint: createdAt }), MESSAGE_FOCUS_ANIMATION_DELAY);
        }
        pendingBottomReachedRef.current = { timeout, timestamp: Date.now() };
        lazyScrollToMessageId({ messageId: foundMessage.messageId, animated: true, timeout });
      } else {
        if (props.channel.messageOffsetTimestamp <= createdAt) {
          if (focusAnimated) {
            props.onUpdateSearchItem({ startingPoint: createdAt });
          }
          props.onResetMessageListWithStartingPoint(createdAt).catch((_) => {});
        } else {
          return false;
        }
      }
      return true;
    },
  );

  const onScrolledAwayFromBottom = useFreshCallback((value: boolean) => {
    scrolledAwayFromBottomRef.current = value;
    props.onScrolledAwayFromBottom(value);
  });

  const scrollToBottom = useFreshCallback(async (animated = false) => {
    if (props.hasNext()) {
      props.onUpdateSearchItem(undefined);
      onScrolledAwayFromBottom(false);

      await props.onResetMessageList().catch((_) => {});
      onScrolledAwayFromBottom(false);
      lazyScrollToBottom({ animated });
    } else {
      lazyScrollToBottom({ animated });
    }
  });

  const onPressUnreadMessagesFloatingCloseButton = useCallback(() => {
    updateHasSeenNewLine(true);
    updateHasUserMarkedAsUnread(false);
    props.resetNewMessages?.();
    confirmAndMarkAsRead([props.channel]);
  }, [updateHasSeenNewLine, updateHasUserMarkedAsUnread, props.channel.url, props.resetNewMessages]);

  const getPrevNonSilentMessage = useCallback(
    (messages: SendbirdMessage[], prevMessageIndex: number): SendbirdMessage | null => {
      if (messages.length <= prevMessageIndex) {
        return null;
      }

      const prevMessage = messages[prevMessageIndex];
      if (prevMessage) {
        if (prevMessage.silent) {
          return getPrevNonSilentMessage(messages, prevMessageIndex + 1);
        } else {
          return prevMessage;
        }
      }
      return null;
    },
    [],
  );

  const findFirstUnreadMessage = useFreshCallback((isNewLineExistInChannel: boolean) => {
    if (!sbOptions.uikit.groupChannel.channel.enableMarkAsUnread || !isNewLineExistInChannel) {
      return;
    }

    return props.messages.find((msg, index) => {
      if (msg.silent) {
        return false;
      }

      const isMarkedAsUnreadMessage = props.channel.myLastRead === msg.createdAt - 1;
      if (isMarkedAsUnreadMessage) {
        return true;
      }

      const prevNonSilentMessage = getPrevNonSilentMessage(props.messages, index + 1);
      const hasNoPreviousAndNoPrevMessage = !props.hasPrevious?.() && prevNonSilentMessage == null;
      const prevMessageIsRead =
        prevNonSilentMessage != null && prevNonSilentMessage.createdAt <= props.channel.myLastRead;
      const isMessageUnread = props.channel.myLastRead < msg.createdAt;
      return (hasNoPreviousAndNoPrevMessage || prevMessageIsRead) && isMessageUnread;
    });
  });

  useEffect(() => {
    if (!unreadFirstMessage) {
      const foundUnreadFirstMessage = findFirstUnreadMessage(props.isNewLineExistInChannel ?? false);
      if (foundUnreadFirstMessage) {
        processNewLineVisibility(foundUnreadFirstMessage);
        setUnreadFirstMessage(foundUnreadFirstMessage);
      }
    }
  }, [props.messages, props.channel.myLastRead, sbOptions.uikit.groupChannel.channel.enableMarkAsUnread]);

  const processNewLineVisibility = useFreshCallback((unreadFirstMsg: SendbirdMessage | undefined) => {
    const isNewLineInViewport = !!viewableMessages.current?.some(
      (message) => message.messageId === unreadFirstMsg?.messageId,
    );

    if (isNewLineInViewportRef.current !== isNewLineInViewport) {
      isNewLineInViewportRef.current = isNewLineInViewport;
      updateUnreadMessagesFloatingProps();
      if (!isNewLineInViewport || hasSeenNewLineRef.current) {
        return;
      }

      updateHasSeenNewLine(true);
      if (hasUserMarkedAsUnreadRef.current) {
        return;
      }

      if (0 < props.newMessages.length) {
        props.channel.markAsUnread(props.newMessages[0]);
      } else {
        props.channel.markAsRead();
      }
    }
  });

  const onViewableItemsChanged = useFreshCallback(
    async (info: { viewableItems: Array<ViewToken<SendbirdMessage>>; changed: Array<ViewToken<SendbirdMessage>> }) => {
      if (!sbOptions.uikit.groupChannel.channel.enableMarkAsUnread) {
        return;
      }

      viewableMessages.current = info.viewableItems.filter((token) => token.item).map((token) => token.item);
      processNewLineVisibility(unreadFirstMessage);
    },
  );

  const onPressMarkAsUnreadMessage = useCallback(
    async (message: SendbirdMessage) => {
      if (sbOptions.uikit.groupChannel.channel.enableMarkAsUnread && message) {
        await props.channel.markAsUnread(message);
        updateHasUserMarkedAsUnread(true);
      }
    },
    [sbOptions.uikit.groupChannel.channel.enableMarkAsUnread, updateHasUserMarkedAsUnread],
  );

  useEffect(() => {
    isNewLineExistInChannelRef.current = !!props.isNewLineExistInChannel && !!viewableMessages.current;
  }, [props.isNewLineExistInChannel, viewableMessages.current]);

  const unreadMessagesFloatingPropsRef = useRef<UnreadMessagesFloatingProps>();
  const updateUnreadMessagesFloatingProps = useFreshCallback(() => {
    const canAutoMarkAsRead =
      !scrolledAwayFromBottomRef.current &&
      !hasUserMarkedAsUnreadRef.current &&
      (hasSeenNewLineRef.current || !isNewLineExistInChannelRef.current);

    unreadMessagesFloatingPropsRef.current = {
      visible:
        sbOptions.uikit.groupChannel.channel.enableMarkAsUnread &&
        !canAutoMarkAsRead &&
        isNewLineExistInChannelRef.current &&
        0 < props.channel.unreadMessageCount &&
        !isNewLineInViewportRef.current,
      onPressClose: onPressUnreadMessagesFloatingCloseButton,
      unreadMessageCount: props.channel.unreadMessageCount,
    };
    if (isVisibleUnreadMessageFloating !== unreadMessagesFloatingPropsRef.current.visible) {
      setIsVisibleUnreadMessageFloating(unreadMessagesFloatingPropsRef.current.visible);
    }
  });

  useEffect(() => {
    updateUnreadMessagesFloatingProps();
  }, [
    isNewLineExistInChannelRef.current,
    props.channel.unreadMessageCount,
    sbOptions.uikit.groupChannel.channel.enableMarkAsUnread,
  ]);

  useGroupChannelHandler(sdk, {
    onReactionUpdated(channel, event) {
      if (isDifferentChannel(channel, props.channel)) return;
      const recentMessage = props.messages[0];
      const isRecentMessage = recentMessage && recentMessage.messageId === event.messageId;
      const scrollReachedBottomAndCanScroll = !props.scrolledAwayFromBottom && !props.hasNext();
      if (isRecentMessage && scrollReachedBottomAndCanScroll) {
        lazyScrollToBottom({ animated: true, timeout: 250 });
      }
    },
    onChannelChanged(channel) {
      if (isDifferentChannel(channel, props.channel)) return;
    },
  });

  useEffect(() => {
    return groupChannelPubSub.subscribe(({ type, data }) => {
      switch (type) {
        case 'TYPING_BUBBLE_RENDERED':
        case 'MESSAGES_RECEIVED': {
          if (!props.scrolledAwayFromBottom) {
            scrollToBottom(true);
          }
          break;
        }
        case 'MESSAGES_UPDATED': {
          const lastMessage = props.channel.lastMessage;
          const [updatedMessage] = data.messages;

          const lastMessageUpdated =
            updatedMessage && lastMessage && lastMessage.messageId === updatedMessage.messageId;

          const isMaybeStreaming = props.channel.hasAiBot && lastMessageUpdated;

          if (isMaybeStreaming) {
            scrollToBottom(false);
          } else if (!props.scrolledAwayFromBottom && lastMessageUpdated) {
            scrollToBottom(true);
          }
          break;
        }
        case 'MESSAGE_SENT_SUCCESS':
        case 'MESSAGE_SENT_PENDING': {
          scrollToBottom(false);
          break;
        }
        case 'ON_MARKED_AS_READ_BY_CURRENT_USER': {
          updateUnreadMessagesFloatingProps();
          break;
        }
        case 'ON_MARKED_AS_UNREAD_BY_CURRENT_USER': {
          isNewLineExistInChannelRef.current = true;
          const foundFirstUnreadMessage = findFirstUnreadMessage(true);
          processNewLineVisibility(foundFirstUnreadMessage);
          setUnreadFirstMessage(foundFirstUnreadMessage);
          if (!props.scrolledAwayFromBottom) {
            scrollToBottom(true);
          }
          break;
        }
      }
    });
  }, [props.scrolledAwayFromBottom]);

  useEffect(() => {
    return groupChannelFragmentOptions.pubsub.subscribe((payload: GroupChannelFragmentOptionsPubSubContextPayload) => {
      switch (payload.type) {
        case 'OVERRIDE_SEARCH_ITEM_STARTING_POINT': {
          scrollToMessageWithCreatedAt(payload.data.startingPoint, false, MESSAGE_SEARCH_SAFE_SCROLL_DELAY);
          break;
        }
      }
    });
  }, []);

  useEffect(() => {
    // Only trigger once when message list mount with initial props.searchItem
    // - Search screen + searchItem > mount message list
    // - Reset message list + searchItem > re-mount message list
    if (isFirstMount && props.searchItem) {
      scrollToMessageWithCreatedAt(props.searchItem.startingPoint, false, MESSAGE_SEARCH_SAFE_SCROLL_DELAY);
    }
  }, [isFirstMount]);

  const onPressParentMessage = useFreshCallback(
    (parentMessage: SendbirdMessage, childMessage: SendbirdSendableMessage) => {
      if (
        onPressReplyMessageInThread &&
        sbOptions.uikit.groupChannel.channel.replyType === 'thread' &&
        sbOptions.uikit.groupChannel.channel.threadReplySelectType === 'thread'
      ) {
        if (parentMessage.createdAt >= props.channel.messageOffsetTimestamp) {
          onPressReplyMessageInThread(parentMessage as SendbirdSendableMessage, childMessage.createdAt);
        } else {
          toast.show(STRINGS.TOAST.FIND_PARENT_MSG_ERROR, 'error');
        }
      } else {
        const canScrollToParent = scrollToMessageWithCreatedAt(parentMessage.createdAt, true, 0);
        if (!canScrollToParent) toast.show(STRINGS.TOAST.FIND_PARENT_MSG_ERROR, 'error');
      }
    },
  );

  const onBottomReached = useFreshCallback(() => {
    if (props.hasNext()) {
      if (pendingBottomReachedRef.current) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - pendingBottomReachedRef.current.timestamp;

        const timeoutThreshold = 500;
        if (elapsedTime >= pendingBottomReachedRef.current.timeout + timeoutThreshold) {
          props.onBottomReached?.();
          pendingBottomReachedRef.current = null;
        }
      } else {
        props.onBottomReached?.();
      }
    }
  });

  return (
    <ChannelMessageList
      {...props}
      ref={flatListRef}
      onScrolledAwayFromBottom={onScrolledAwayFromBottom}
      onReplyMessage={setMessageToReply}
      onReplyInThreadMessage={setMessageToReply}
      onEditMessage={setMessageToEdit}
      onViewableItemsChanged={onViewableItemsChanged}
      onPressParentMessage={onPressParentMessage}
      onPressNewMessagesButton={scrollToBottom}
      onPressScrollToBottomButton={scrollToBottom}
      onPressMarkAsUnreadMessage={onPressMarkAsUnreadMessage}
      onBottomReached={onBottomReached}
      unreadFirstMessage={unreadFirstMessage}
      unreadMessagesFloatingProps={unreadMessagesFloatingPropsRef.current}
    />
  );
};

export default React.memo(GroupChannelMessageList);
