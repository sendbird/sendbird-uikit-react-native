import { useReducer } from 'react';

import { SendableMessage } from '@sendbird/chat/lib/__definition';
import { SendingStatus } from '@sendbird/chat/message';
import type { SendbirdBaseMessage } from '@sendbird/uikit-utils';
import {
  SendbirdMessage,
  arrayToMapWithGetter,
  getMessageUniqId,
  isMyMessage,
  isNewMessage,
  isSendableMessage,
  useIIFE,
} from '@sendbird/uikit-utils';

type Options = {
  sortComparator?: (a: SendbirdMessage, b: SendbirdMessage) => number;
};

type Action =
  | {
      type: 'update_loading' | 'update_refreshing';
      value: { status: boolean };
    }
  | {
      type: 'update_messages' | 'update_new_messages';
      value: { messages: SendbirdBaseMessage[]; clearBeforeAction: boolean; currentUserId?: string };
    }
  | {
      type: 'delete_messages' | 'delete_new_messages';
      value: { messageIds: (string | number)[]; reqIds: string[] };
    };

type State = {
  loading: boolean;
  refreshing: boolean;
  messageMap: Record<string, SendbirdBaseMessage>;
  newMessageMap: Record<string, SendbirdBaseMessage>;
};

const defaultReducer = ({ ...draft }: State, action: Action) => {
  switch (action.type) {
    case 'update_refreshing': {
      draft['refreshing'] = action.value.status;
      return draft;
    }
    case 'update_loading': {
      draft['loading'] = action.value.status;
      return draft;
    }
    case 'update_messages': {
      const userId = action.value.currentUserId;

      if (action.value.clearBeforeAction) {
        draft['messageMap'] = messagesToObject(action.value.messages);
      } else {
        // Filtering meaningless message updates
        const nextMessages = action.value.messages.filter((next) => {
          if (isMyMessage(next, userId)) {
            const prev = draft['messageMap'][next.reqId] ?? draft['messageMap'][next.messageId];
            if (isMyMessage(prev, userId)) {
              const shouldUpdate = shouldUpdateMessage(prev, next);
              if (shouldUpdate) {
                // Remove existing messages before update to prevent duplicate display
                delete draft['messageMap'][prev.reqId];
                delete draft['messageMap'][prev.messageId];
              }
              return shouldUpdate;
            }
          }
          return true;
        });

        const obj = messagesToObject(nextMessages);
        draft['messageMap'] = { ...draft['messageMap'], ...obj };
      }

      return draft;
    }
    case 'update_new_messages': {
      const userId = action.value.currentUserId;
      const newMessages = action.value.messages.filter((it) => isNewMessage(it, userId));

      if (action.value.clearBeforeAction) {
        draft['newMessageMap'] = arrayToMapWithGetter(newMessages, getMessageUniqId);
      } else {
        // Remove existing messages before update to prevent duplicate display
        const messageKeys = newMessages.map((it) => it.messageId);
        messageKeys.forEach((key) => delete draft['newMessageMap'][key]);

        draft['newMessageMap'] = {
          ...draft['newMessageMap'],
          ...arrayToMapWithGetter(newMessages, getMessageUniqId),
        };
      }

      return draft;
    }
    case 'delete_messages':
    case 'delete_new_messages': {
      const key = action.type === 'delete_messages' ? 'messageMap' : 'newMessageMap';
      draft[key] = { ...draft[key] };
      action.value.messageIds.forEach((msgId) => {
        const message = draft[key][msgId];
        if (message) {
          if (isSendableMessage(message)) delete draft[key][message.reqId];
          delete draft[key][message.messageId];
        }
      });
      action.value.reqIds.forEach((reqId) => {
        const message = draft[key][reqId];
        if (message) {
          if (isSendableMessage(message)) delete draft[key][message.reqId];
          delete draft[key][message.messageId];
        }
      });

      return draft;
    }
  }
};

const messagesToObject = (messages: SendbirdBaseMessage[]) => {
  return messages.reduce((accum, curr) => {
    if (isSendableMessage(curr)) {
      accum[curr.reqId] = curr;
      if (curr.sendingStatus === SendingStatus.SUCCEEDED) {
        accum[curr.messageId] = curr;
      }
    } else {
      accum[curr.messageId] = curr;
    }
    return accum;
  }, {} as Record<string, SendbirdBaseMessage>);
};

const shouldUpdateMessage = (prev: SendableMessage, next: SendableMessage) => {
  // message data update (e.g. reactions)
  if (prev.sendingStatus === SendingStatus.SUCCEEDED) return next.sendingStatus === SendingStatus.SUCCEEDED;

  // message sending status update
  return prev.sendingStatus !== next.sendingStatus;
};

export const useChannelMessagesReducer = (sortComparator?: Options['sortComparator']) => {
  const [{ loading, refreshing, messageMap, newMessageMap }, dispatch] = useReducer(defaultReducer, {
    loading: true,
    refreshing: false,
    messageMap: {},
    newMessageMap: {},
  });

  const updateMessages = (messages: SendbirdBaseMessage[], clearBeforeAction: boolean, currentUserId?: string) => {
    dispatch({ type: 'update_messages', value: { messages, clearBeforeAction, currentUserId } });
  };
  const deleteMessages = (messageIds: (string | number)[], reqIds: string[]) => {
    dispatch({ type: 'delete_messages', value: { messageIds, reqIds } });
  };
  const updateNewMessages = (messages: SendbirdBaseMessage[], clearBeforeAction: boolean, currentUserId?: string) => {
    dispatch({ type: 'update_new_messages', value: { messages, clearBeforeAction, currentUserId } });
  };
  const deleteNewMessages = (messageIds: number[], reqIds: string[]) => {
    dispatch({ type: 'delete_new_messages', value: { messageIds, reqIds } });
  };
  const updateLoading = (status: boolean) => {
    dispatch({ type: 'update_loading', value: { status } });
  };
  const updateRefreshing = (status: boolean) => {
    dispatch({ type: 'update_refreshing', value: { status } });
  };

  const messages = useIIFE(() => {
    if (sortComparator) return Array.from(new Set(Object.values(messageMap))).sort(sortComparator);
    return Array.from(new Set(Object.values(messageMap)));
  });
  const newMessages = Object.values(newMessageMap);

  return {
    updateLoading,
    updateRefreshing,
    updateMessages,
    deleteMessages,

    loading,
    refreshing,
    messages,

    newMessages,
    updateNewMessages,
    deleteNewMessages,
  };
};
