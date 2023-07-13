import React, { useContext, useEffect, useRef } from 'react';
import type { FlatList } from 'react-native';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { isDifferentChannel, useFreshCallback, useIsFirstMount, useUniqHandlerId } from '@sendbird/uikit-utils';

import ChannelMessageList from '../../../components/ChannelMessageList';
import { MESSAGE_FOCUS_ANIMATION_DELAY, MESSAGE_SEARCH_SAFE_SCROLL_DELAY } from '../../../constants';
import { useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelMessageList = (props: GroupChannelProps['MessageList']) => {
  const { sdk } = useSendbirdChat();
  const { setMessageToEdit, setMessageToReply } = useContext(GroupChannelContexts.Fragment);
  const { subscribe } = useContext(GroupChannelContexts.PubSub);

  const id = useUniqHandlerId('GroupChannelMessageList');
  const ref = useRef<FlatList<SendbirdMessage>>(null);
  const isFirstMount = useIsFirstMount();

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToBottom = (animated = false, timeout = 0) => {
    setTimeout(() => {
      ref.current?.scrollToOffset({ offset: 0, animated });
    }, timeout);
  };

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToIndex = (index = 0, animated = false, timeout = 0) => {
    setTimeout(() => {
      ref.current?.scrollToIndex({ index, animated, viewPosition: 0.5 });
    }, timeout);
  };

  const scrollToMessage = useFreshCallback((createdAt: number, focusAnimated = false) => {
    const foundMessageIndex = props.messages.findIndex((it) => it.createdAt === createdAt);
    const isIncludedInList = foundMessageIndex > -1;

    if (isIncludedInList) {
      if (focusAnimated) {
        setTimeout(() => props.onUpdateSearchItem({ startingPoint: createdAt }), MESSAGE_FOCUS_ANIMATION_DELAY);
      }
      lazyScrollToIndex(foundMessageIndex, true, isFirstMount ? MESSAGE_SEARCH_SAFE_SCROLL_DELAY : 0);
    } else {
      if (focusAnimated) {
        props.onUpdateSearchItem({ startingPoint: createdAt });
      }
      props.onResetMessageListWithStartingPoint(createdAt);
    }
  });

  const scrollToBottom = useFreshCallback((animated = false) => {
    if (props.hasNext()) {
      props.onUpdateSearchItem(undefined);
      props.onScrolledAwayFromBottom(false);

      props.onResetMessageList(() => {
        props.onScrolledAwayFromBottom(false);
        lazyScrollToBottom(animated);
      });
    } else {
      lazyScrollToBottom(animated);
    }
  });

  useChannelHandler(sdk, id, {
    onReactionUpdated(channel, event) {
      if (isDifferentChannel(channel, props.channel)) return;
      const recentMessage = props.messages[0];
      const isRecentMessage = recentMessage && recentMessage.messageId === event.messageId;
      const scrollReachedBottomAndCanScroll = !props.scrolledAwayFromBottom && !props.hasNext();
      if (isRecentMessage && scrollReachedBottomAndCanScroll) {
        lazyScrollToBottom(true, 250);
      }
    },
  });

  useEffect(() => {
    return subscribe(({ type }) => {
      switch (type) {
        case 'MESSAGES_RECEIVED': {
          if (!props.scrolledAwayFromBottom) {
            scrollToBottom(true);
          }
          break;
        }
        case 'MESSAGE_SENT_SUCCESS':
        case 'MESSAGE_SENT_PENDING': {
          scrollToBottom(false);
          break;
        }
      }
    });
  }, [props.scrolledAwayFromBottom]);

  // Only trigger once when message list mount with initial props.searchItem
  // - Search screen + searchItem > mount message list
  // - Reset message list + searchItem > re-mount message list
  useEffect(() => {
    if (isFirstMount && props.searchItem) {
      scrollToMessage(props.searchItem.startingPoint);
    }
  }, [isFirstMount]);

  const onPressParentMessage = useFreshCallback((message: SendbirdMessage) => {
    scrollToMessage(message.createdAt, true);
  });

  return (
    <ChannelMessageList
      {...props}
      ref={ref}
      onReplyMessage={setMessageToReply}
      onEditMessage={setMessageToEdit}
      onPressParentMessage={onPressParentMessage}
      onPressNewMessagesButton={scrollToBottom}
      onPressScrollToBottomButton={scrollToBottom}
    />
  );
};

export default React.memo(GroupChannelMessageList);
