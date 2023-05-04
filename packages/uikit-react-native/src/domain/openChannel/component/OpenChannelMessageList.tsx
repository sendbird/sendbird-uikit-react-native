import React, { useContext, useEffect, useRef, useState } from 'react';
import type { FlatList } from 'react-native';

import { SendbirdMessage, useFreshCallback } from '@sendbird/uikit-utils';

import ChannelMessageList from '../../../components/ChannelMessageList';
import { OpenChannelContexts } from '../module/moduleContext';
import type { OpenChannelProps } from '../types';

const OpenChannelMessageList = (props: OpenChannelProps['MessageList']) => {
  const { setMessageToEdit } = useContext(OpenChannelContexts.Fragment);
  const { subscribe } = useContext(OpenChannelContexts.PubSub);

  const ref = useRef<FlatList<SendbirdMessage>>(null);
  const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = useState(false);

  const scrollToBottom = useFreshCallback((animated = false) => {
    // FIXME: Workaround, should run after data has been applied to UI.
    setTimeout(() => {
      ref.current?.scrollToOffset({ offset: 0, animated });
    }, 0);
  });

  useEffect(() => {
    return subscribe(({ type }) => {
      switch (type) {
        case 'MESSAGES_RECEIVED': {
          scrollToBottom(false);
          break;
        }
        case 'MESSAGE_SENT_SUCCESS':
        case 'MESSAGE_SENT_PENDING': {
          scrollToBottom(false);
          break;
        }
      }
    });
  }, []);

  return (
    <ChannelMessageList
      {...props}
      ref={ref}
      onPressScrollToBottomButton={scrollToBottom}
      onPressNewMessagesButton={scrollToBottom}
      scrolledAwayFromBottom={scrolledAwayFromBottom}
      onScrolledAwayFromBottom={setScrolledAwayFromBottom}
      onEditMessage={setMessageToEdit}
    />
  );
};

export default React.memo(OpenChannelMessageList);
