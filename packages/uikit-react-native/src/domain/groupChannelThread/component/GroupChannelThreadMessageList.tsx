import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';

import { useGroupChannelHandler } from '@sendbird/uikit-tools';
import { isDifferentChannel, useFreshCallback } from '@sendbird/uikit-utils';

import ChannelThreadMessageList from '../../../components/ChannelThreadMessageList';
import { useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelThreadContexts } from '../module/moduleContext';
import type { GroupChannelThreadProps } from '../types';

const GroupChannelThreadMessageList = (props: GroupChannelThreadProps['MessageList']) => {
  const { sdk } = useSendbirdChat();
  const { setMessageToEdit } = useContext(GroupChannelThreadContexts.Fragment);
  const { subscribe } = useContext(GroupChannelThreadContexts.PubSub);
  const { flatListRef, lazyScrollToBottom, lazyScrollToIndex } = useContext(GroupChannelThreadContexts.MessageList);

  const ignorePropReached = useRef(false);

  const _onTopReached = () => {
    if (!ignorePropReached.current) {
      props.onTopReached();
    }
  };

  const _onBottomReached = () => {
    if (!ignorePropReached.current) {
      props.onBottomReached();
    }
  };

  const scrollToBottom = useFreshCallback(async (animated = false) => {
    if (props.hasNext()) {
      props.onScrolledAwayFromBottom(false);

      await props.onResetMessageList().catch((_) => {});
      props.onScrolledAwayFromBottom(false);
      lazyScrollToBottom({ animated });
    } else {
      lazyScrollToBottom({ animated });
    }
  });

  useLayoutEffect(() => {
    if (props.startingPoint) {
      const foundMessageIndex = props.messages.findIndex((it) => it.createdAt === props.startingPoint);
      const isIncludedInList = foundMessageIndex > -1;
      if (isIncludedInList) {
        ignorePropReached.current = true;
        const timeout = 300;
        lazyScrollToIndex({ index: foundMessageIndex, animated: true, timeout: timeout });
        setTimeout(() => {
          ignorePropReached.current = false;
        }, timeout + 50);
      }
    }
  }, [props.startingPoint]);

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
  });

  useEffect(() => {
    return subscribe(({ type, data }) => {
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
      }
    });
  }, [props.scrolledAwayFromBottom]);

  return (
    <ChannelThreadMessageList
      {...props}
      ref={flatListRef}
      onTopReached={_onTopReached}
      onBottomReached={_onBottomReached}
      onEditMessage={setMessageToEdit}
      onPressNewMessagesButton={scrollToBottom}
      onPressScrollToBottomButton={scrollToBottom}
      renderNewMessagesButton={null}
      renderScrollToBottomButton={null}
    />
  );
};

export default React.memo(GroupChannelThreadMessageList);
