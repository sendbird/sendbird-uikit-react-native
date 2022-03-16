import { useMemo, useReducer } from 'react';
import type Sendbird from 'sendbird';

import { SendbirdMessage, arrayToMap, isNewMessage } from '@sendbird/uikit-utils';

import type { UseGroupChannelMessagesOptions } from '../../types';

type Action =
  | {
      type: 'update_loading' | 'update_refreshing';
      value: { status: boolean };
    }
  | {
      type: 'update_messages' | 'update_next_messages';
      value: { messages: Sendbird.BaseMessageInstance[]; clearPrev: boolean };
    }
  | {
      type: 'delete_messages' | 'delete_next_messages';
      value: { messageIds: number[]; reqIds: string[] };
    };

type State = {
  loading: boolean;
  refreshing: boolean;
  messageMap: Record<string, SendbirdMessage>;
  nextMessageMap: Record<string, SendbirdMessage>;
};

const defaultReducer = ({ ...draft }: State, action: Action) => {
  switch (action.type) {
    case 'update_refreshing':
    case 'update_loading': {
      const key = action.type === 'update_loading' ? 'loading' : 'refreshing';
      draft[key] = action.value.status;

      return draft;
    }
    case 'update_messages':
    case 'update_next_messages': {
      const key = action.type === 'update_messages' ? 'messageMap' : 'nextMessageMap';
      const messageMap = arrayToMap(action.value.messages, 'reqId', 'messageId');
      if (action.value.clearPrev) draft[key] = messageMap;
      else draft[key] = { ...draft[key], ...messageMap };

      return draft;
    }
    case 'delete_messages':
    case 'delete_next_messages': {
      const key = action.type === 'delete_messages' ? 'messageMap' : 'nextMessageMap';
      action.value.messageIds.forEach((msgId) => delete draft[key][msgId]);
      action.value.reqIds.forEach((reqId) => delete draft[key][reqId]);

      return draft;
    }
  }
};

export const useGroupChannelMessagesReducer = (
  userId?: string,
  sortComparator?: UseGroupChannelMessagesOptions['sortComparator'],
) => {
  const [{ loading, refreshing, messageMap, nextMessageMap }, dispatch] = useReducer(defaultReducer, {
    loading: false,
    refreshing: false,
    messageMap: {},
    nextMessageMap: {},
  });

  const updateMessages = (messages: Sendbird.BaseMessageInstance[], clearPrev: boolean) => {
    dispatch({ type: 'update_messages', value: { messages, clearPrev } });
  };
  const deleteMessages = (messageIds: number[], reqIds: string[]) => {
    dispatch({ type: 'delete_messages', value: { messageIds, reqIds } });
  };
  const updateNextMessages = (messages: Sendbird.BaseMessageInstance[], clearPrev: boolean) => {
    dispatch({ type: 'update_next_messages', value: { messages, clearPrev } });
  };
  const deleteNextMessages = (messageIds: number[], reqIds: string[]) => {
    dispatch({ type: 'delete_next_messages', value: { messageIds, reqIds } });
  };
  const updateLoading = (status: boolean) => {
    dispatch({ type: 'update_loading', value: { status } });
  };
  const updateRefreshing = (status: boolean) => {
    dispatch({ type: 'update_refreshing', value: { status } });
  };

  const messages = useMemo(() => {
    if (sortComparator) return Object.values(messageMap).sort(sortComparator);
    return Object.values(messageMap);
  }, [sortComparator, messageMap]);
  const nextMessages = Object.values(nextMessageMap);
  const newMessagesFromNext = nextMessages.filter((msg) => isNewMessage(msg, userId));

  return {
    updateLoading,
    updateRefreshing,
    updateMessages,
    updateNextMessages,
    deleteMessages,
    deleteNextMessages,

    loading,
    refreshing,
    messages,
    nextMessages,
    newMessagesFromNext,
  };
};
