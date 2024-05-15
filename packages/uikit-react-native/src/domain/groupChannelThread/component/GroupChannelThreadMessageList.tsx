import React, { useContext, useEffect } from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { useToast } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { isDifferentChannel, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';

import ChannelMessageList from '../../../components/ChannelMessageList';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelThreadContexts } from '../module/moduleContext';
import type { GroupChannelThreadProps } from '../types';

const GroupChannelThreadMessageList = (props: GroupChannelThreadProps['MessageList']) => {
  const toast = useToast();
  const { STRINGS } = useLocalization();
  const { sdk } = useSendbirdChat();
  const { setMessageToEdit } = useContext(GroupChannelThreadContexts.Fragment);
  const { subscribe } = useContext(GroupChannelThreadContexts.PubSub);
  const { flatListRef, lazyScrollToBottom, lazyScrollToIndex } = useContext(GroupChannelThreadContexts.MessageList);
  
  const id = useUniqHandlerId('GroupChannelThreadMessageList');
  
  const scrollToMessageWithCreatedAt = useFreshCallback(
    (createdAt: number, timeout: number): boolean => {
      const foundMessageIndex = props.messages.findIndex((it) => it.createdAt === createdAt);
      const isIncludedInList = foundMessageIndex > -1;
      
      if (isIncludedInList) {
        lazyScrollToIndex({ index: foundMessageIndex, animated: true, timeout });
      } else {
        if (props.channel.messageOffsetTimestamp <= createdAt) {
          props.onResetMessageListWithStartingPoint(createdAt);
        } else {
          return false;
        }
      }
      return true;
    },
  );
  
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
  
  const onPressParentMessage = useFreshCallback((message: SendbirdMessage) => {
    const canScrollToParent = scrollToMessageWithCreatedAt(message.createdAt, 0);
    if (!canScrollToParent) toast.show(STRINGS.TOAST.FIND_PARENT_MSG_ERROR, 'error');
  });
  
  return (
    <ChannelMessageList
      {...props}
      ref={flatListRef}
      onEditMessage={setMessageToEdit}
      onPressParentMessage={onPressParentMessage}
      onPressNewMessagesButton={scrollToBottom}
      onPressScrollToBottomButton={scrollToBottom}
    />
  );
};

export default React.memo(GroupChannelThreadMessageList);
