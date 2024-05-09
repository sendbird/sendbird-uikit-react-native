import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { isDifferentChannel, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';
import React, { useContext, useEffect, useLayoutEffect } from 'react';

import ChannelMessageList from '../../../components/ChannelMessageList';
import { useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelThreadContexts } from '../module/moduleContext';
import type { GroupChannelThreadProps } from '../types';

const GroupChannelThreadMessageList = (props: GroupChannelThreadProps['MessageList']) => {
  const { sdk } = useSendbirdChat();
  const { setMessageToEdit } = useContext(GroupChannelThreadContexts.Fragment);
  const { subscribe } = useContext(GroupChannelThreadContexts.PubSub);
  const { flatListRef, lazyScrollToBottom, lazyScrollToIndex } = useContext(GroupChannelThreadContexts.MessageList);
  
  const id = useUniqHandlerId('GroupChannelThreadMessageList');
  
  const scrollToBottom = useFreshCallback(async (animated = false) => {
    if (props.hasNext()) {
      props.onScrolledAwayFromBottom(false);
      
      await props.onResetMessageList();
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
        lazyScrollToIndex({ index: foundMessageIndex, animated: true, timeout: 100 });
      }
    }
  }, [props.startingPoint]);
  
  useChannelHandler(sdk, id, {
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
    return subscribe(({ type }) => {
      switch (type) {
        case 'TYPING_BUBBLE_RENDERED':
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
  
  return (
    <ChannelMessageList
      {...props}
      ref={flatListRef}
      onEditMessage={setMessageToEdit}
      onPressNewMessagesButton={scrollToBottom}
      onPressScrollToBottomButton={scrollToBottom}
    />
  );
};

export default React.memo(GroupChannelThreadMessageList);
