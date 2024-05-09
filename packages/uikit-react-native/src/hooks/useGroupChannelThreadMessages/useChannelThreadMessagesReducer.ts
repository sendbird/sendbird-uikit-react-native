import { useMemo, useReducer } from 'react';

import type { SendableMessage } from '@sendbird/chat/lib/__definition';
import type { BaseMessage } from '@sendbird/chat/message';
import { SendingStatus } from '@sendbird/chat/message';

import type { SendbirdMessage } from '@sendbird/uikit-tools/src/types';
import { getMessageUniqId, isMyMessage, isNewMessage, isSendableMessage } from '@sendbird/uikit-tools';

export function arrayToMapWithGetter<T>(arr: T[], getSelector: (item: T) => string) {
  return arr.reduce((accum, curr) => {
    const _key = getSelector(curr);
    accum[_key] = curr;
    return accum;
  }, {} as Record<string, T>);
}

type Action =
  | {
      type: 'update_initialized' | 'update_loading' | 'update_refreshing' | 'update_has_previous' | 'update_has_next';
      value: { status: boolean };
    }
  | {
      type: 'update_messages' | 'update_new_messages';
      value: { messages: BaseMessage[]; clearBeforeAction: boolean; currentUserId?: string };
    }
  | {
      type: 'delete_messages' | 'delete_new_messages';
      value: { messageIds: number[]; reqIds: string[] };
    };

type State = {
  initialized: boolean;
  loading: boolean;
  refreshing: boolean;
  hasPreviousMessages: boolean,
  hasNextMessages: boolean,
  messageMap: Record<string, BaseMessage>;
  newMessageMap: Record<string, BaseMessage>;
};

const defaultReducer = ({ ...draft }: State, action: Action) => {
  switch (action.type) {
    case 'update_initialized': {
      draft['initialized'] = action.value.status;
      return draft;
    }
    case 'update_refreshing': {
      draft['refreshing'] = action.value.status;
      return draft;
    }
    case 'update_loading': {
      draft['loading'] = action.value.status;
      return draft;
    }
    case 'update_has_previous': {
      draft['hasPreviousMessages'] = action.value.status;
      return draft;
    }
    case 'update_has_next': {
      draft['hasNextMessages'] = action.value.status;
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

const messagesToObject = (messages: BaseMessage[]) => {
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
  }, {} as Record<string, BaseMessage>);
};

const shouldUpdateMessage = (prev: SendableMessage, next: SendableMessage) => {
  // message data update (e.g. reactions)
  if (prev.sendingStatus === SendingStatus.SUCCEEDED) return next.sendingStatus === SendingStatus.SUCCEEDED;

  // message sending status update
  return prev.sendingStatus !== next.sendingStatus;
};

const getOldestMessageTimeStamp = (messages: BaseMessage[]) => {
  return messages.reduce((accum, curr) => {
    return Math.min(accum, curr.createdAt);
  }, Number.MAX_SAFE_INTEGER);
};

const getLatestMessageTimeStamp = (messages: BaseMessage[]) => {
  return messages.reduce((accum, curr) => {
    return Math.max(accum, curr.createdAt);
  }, Number.MIN_SAFE_INTEGER);
};

export const useChannelThreadMessagesReducer = (sortComparator = defaultMessageComparator) => {
  const [{ initialized, loading, refreshing, hasPreviousMessages, hasNextMessages, messageMap, newMessageMap }, dispatch] = useReducer(defaultReducer, {
    initialized: false,
    loading: true,
    refreshing: false,
    hasPreviousMessages: false,
    hasNextMessages: false,
    messageMap: {},
    newMessageMap: {},
  });

  const updateMessages = (messages: BaseMessage[], clearBeforeAction: boolean, currentUserId?: string) => {
    dispatch({ type: 'update_messages', value: { messages, clearBeforeAction, currentUserId } });
  };
  const deleteMessages = (messageIds: number[], reqIds: string[]) => {
    dispatch({ type: 'delete_messages', value: { messageIds, reqIds } });
  };
  const updateNewMessages = (messages: BaseMessage[], clearBeforeAction: boolean, currentUserId?: string) => {
    dispatch({ type: 'update_new_messages', value: { messages, clearBeforeAction, currentUserId } });
  };
  const deleteNewMessages = (messageIds: number[], reqIds: string[]) => {
    dispatch({ type: 'delete_new_messages', value: { messageIds, reqIds } });
  };
  const updateInitialized = (status: boolean) => {
    dispatch({ type: 'update_initialized', value: { status } });
  };
  const updateLoading = (status: boolean) => {
    dispatch({ type: 'update_loading', value: { status } });
  };
  const updateRefreshing = (status: boolean) => {
    dispatch({ type: 'update_refreshing', value: { status } });
  };
  const updateHasPreviousMessages = (status: boolean) => {
    dispatch({ type: 'update_has_previous', value: { status } });
  };
  const updateHasNextMessages = (status: boolean) => {
    dispatch({ type: 'update_has_next', value: { status } });
  };

  const newMessages = Object.values(newMessageMap);
  const messages = useMemo(() => Array.from(new Set(Object.values(messageMap))).sort(sortComparator), [messageMap]);
  const oldestMessageTimeStamp = getOldestMessageTimeStamp(messages);
  const latestMessageTimeStamp = getLatestMessageTimeStamp(messages);
  
  return {
    updateInitialized,
    updateLoading,
    updateRefreshing,
    updateMessages,
    deleteMessages,
    updateHasPreviousMessages,
    updateHasNextMessages,

    initialized,
    loading,
    refreshing,
    hasPreviousMessages,
    hasNextMessages,
    oldestMessageTimeStamp,
    latestMessageTimeStamp,
    messages,

    newMessages,
    updateNewMessages,
    deleteNewMessages,
  };
};

const LARGE_OFFSET = Math.floor(Number.MAX_SAFE_INTEGER / 10);
export function defaultMessageComparator(a: SendbirdMessage, b: SendbirdMessage) {
  let aStatusOffset = 0;
  let bStatusOffset = 0;

  if (isSendableMessage(a) && a.sendingStatus !== 'succeeded') aStatusOffset = LARGE_OFFSET;
  if (isSendableMessage(b) && b.sendingStatus !== 'succeeded') bStatusOffset = LARGE_OFFSET;

  return a.createdAt + aStatusOffset - (b.createdAt + bStatusOffset);
}
