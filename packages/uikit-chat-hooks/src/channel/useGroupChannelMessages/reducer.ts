import { useReducer } from 'react';

import type { SendbirdBaseMessage, SendbirdFileMessage, SendbirdUserMessage } from '@sendbird/uikit-utils';
import { arrayToMapWithGetter, getMessageUniqId, isMyMessage, isNewMessage, useIIFE } from '@sendbird/uikit-utils';

import type { UseGroupChannelMessagesOptions } from '../../types';

type Action =
  | {
      type: 'update_loading' | 'update_refreshing';
      value: { status: boolean };
    }
  | {
      type: 'update_messages' | 'update_next_messages';
      value: { messages: SendbirdBaseMessage[]; clearPrev: boolean; currentUserId?: string };
    }
  | {
      type: 'delete_messages' | 'delete_next_messages';
      value: { messageIds: number[]; reqIds: string[] };
    };

type State = {
  loading: boolean;
  refreshing: boolean;
  messageMap: Record<string, SendbirdBaseMessage>;
  nextMessageMap: Record<string, SendbirdBaseMessage>;
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
      const receivedMessagesAsMap = arrayToMapWithGetter(action.value.messages, getMessageUniqId);
      if (action.value.clearPrev) {
        draft[key] = receivedMessagesAsMap;
      } else {
        draft[key] = { ...draft[key], ...receivedMessagesAsMap };

        // NOTE: Replace pending message to succeeded message
        action.value.messages
          .filter((m): m is SendbirdUserMessage | SendbirdFileMessage => {
            return (
              (m.isFileMessage() || m.isUserMessage()) &&
              Boolean(draft[key][m.reqId]) &&
              m.sendingStatus === 'succeeded' &&
              isMyMessage(m, action.value.currentUserId)
            );
          })
          .forEach((m) => delete draft[key][m.reqId]);
      }

      return draft;
    }
    case 'delete_messages':
    case 'delete_next_messages': {
      const key = action.type === 'delete_messages' ? 'messageMap' : 'nextMessageMap';
      draft[key] = { ...draft[key] };
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
    loading: true,
    refreshing: false,
    messageMap: {},
    nextMessageMap: {},
  });

  const updateMessages = (messages: SendbirdBaseMessage[], clearPrev: boolean, currentUserId?: string) => {
    dispatch({ type: 'update_messages', value: { messages, clearPrev, currentUserId } });
  };
  const deleteMessages = (messageIds: number[], reqIds: string[]) => {
    dispatch({ type: 'delete_messages', value: { messageIds, reqIds } });
  };
  const updateNextMessages = (messages: SendbirdBaseMessage[], clearPrev: boolean, currentUserId?: string) => {
    dispatch({ type: 'update_next_messages', value: { messages, clearPrev, currentUserId } });
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

  const messages = useIIFE(() => {
    if (sortComparator) return Object.values(messageMap).sort(sortComparator);
    return Object.values(messageMap);
  });
  const nextMessages = Object.values(nextMessageMap);
  const newMessagesFromMembers = nextMessages.filter((msg) => isNewMessage(msg, userId));

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
    newMessagesFromMembers,
  };
};
