import React, { useContext, useEffect, useRef } from 'react';
import type { FlatList } from 'react-native';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { isDifferentChannel, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';

import ChannelMessageList from '../../../components/ChannelMessageList';
import { useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelMessageList = (props: GroupChannelProps['MessageList']) => {
  const { sdk } = useSendbirdChat();
  const { setMessageToEdit } = useContext(GroupChannelContexts.Fragment);
  const { subscribe } = useContext(GroupChannelContexts.PubSub);

  const id = useUniqHandlerId('GroupChannelMessageList');
  const ref = useRef<FlatList<SendbirdMessage>>(null);

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToBottom = (animated = false, timeout = 0) => {
    setTimeout(() => {
      ref.current?.scrollToOffset({ offset: 0, animated });
    }, timeout);
  };

  const scrollToBottom = useFreshCallback((animated = false) => {
    if (props.hasNext()) {
      props.onResetMessageList(() => {
        lazyScrollToBottom(animated);
        props.onScrolledAwayFromBottom(false);
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
      ref={ref}
      onEditMessage={setMessageToEdit}
      onPressNewMessagesButton={scrollToBottom}
      onPressScrollToBottomButton={scrollToBottom}
    />
  );
};

export default React.memo(GroupChannelMessageList);
