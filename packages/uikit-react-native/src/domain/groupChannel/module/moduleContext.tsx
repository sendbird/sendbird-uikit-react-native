import React, { createContext, useCallback, useRef, useState } from 'react';
import type { FlatList } from 'react-native';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import {
  ContextValue,
  Logger,
  NOOP,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdUser,
  SendbirdUserMessage,
  getGroupChannelChatAvailableState,
  isDifferentChannel,
  useFreshCallback,
  useUniqHandlerId,
} from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { MESSAGE_FOCUS_ANIMATION_DELAY } from '../../../constants';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import type { PubSub } from '../../../utils/pubsub';
import type { GroupChannelContextsType, GroupChannelModule, GroupChannelPubSubContextPayload } from '../types';
import { GroupChannelProps } from '../types';

export const GroupChannelContexts: GroupChannelContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdGroupChannel,
    setMessageToEdit: NOOP,
    setMessageToReply: NOOP,
  }),
  TypingIndicator: createContext({
    typingUsers: [] as SendbirdUser[],
  }),
  PubSub: createContext({
    publish: NOOP,
    subscribe: () => NOOP,
  } as PubSub<GroupChannelPubSubContextPayload>),
  MessageList: createContext({
    flatListRef: { current: null },
    scrollToMessage: () => false,
    lazyScrollToBottom: () => {
      // noop
    },
    lazyScrollToIndex: () => {
      // noop
    },
  } as MessageListContextValue),
};

export const GroupChannelContextsProvider: GroupChannelModule['Provider'] = ({
  children,
  channel,
  enableTypingIndicator,
  keyboardAvoidOffset = 0,
  groupChannelPubSub,
  messages,
  onUpdateSearchItem,
  onPressReplyMessageInThread,
}) => {
  if (!channel) throw new Error('GroupChannel is not provided to GroupChannelModule');

  const handlerId = useUniqHandlerId('GroupChannelContextsProvider');
  const { STRINGS } = useLocalization();
  const { currentUser, sdk, sbOptions } = useSendbirdChat();

  const [typingUsers, setTypingUsers] = useState<SendbirdUser[]>([]);
  const [messageToEdit, setMessageToEdit] = useState<SendbirdUserMessage | SendbirdFileMessage>();
  const [messageToReply, setMessageToReply] = useState<SendbirdUserMessage | SendbirdFileMessage>();

  const { flatListRef, lazyScrollToIndex, lazyScrollToBottom, scrollToMessage } = useScrollActions({
    messages,
    onUpdateSearchItem,
  });

  const updateInputMode = (mode: 'send' | 'edit' | 'reply', message?: SendbirdUserMessage | SendbirdFileMessage) => {
    if (mode === 'send' || !message) {
      setMessageToEdit(undefined);
      setMessageToReply(undefined);
      return;
    } else if (mode === 'edit') {
      setMessageToEdit(message);
      setMessageToReply(undefined);
      return;
    } else if (mode === 'reply') {
      setMessageToEdit(undefined);
      setMessageToReply(message);
      return;
    }
  };

  const onPressMessageToReply = (parentMessage?: SendbirdUserMessage | SendbirdFileMessage) => {
    if (sbOptions.uikit.groupChannel.channel.replyType === 'thread' && parentMessage) {
      onPressReplyMessageInThread?.(parentMessage, Number.MAX_SAFE_INTEGER);
    } else if (sbOptions.uikit.groupChannel.channel.replyType === 'quote_reply') {
      updateInputMode('reply', parentMessage);
    }
  };

  useChannelHandler(sdk, handlerId, {
    onMessageDeleted(_, messageId) {
      if (messageToReply?.messageId === messageId) {
        setMessageToReply(undefined);
      }
    },
    onChannelFrozen(frozenChannel) {
      if (frozenChannel.url === channel.url) {
        if (frozenChannel.isGroupChannel() && getGroupChannelChatAvailableState(channel).frozen) {
          setMessageToReply(undefined);
        }
      }
    },
    onUserMuted(mutedChannel, user) {
      if (mutedChannel.url === channel.url && user.userId === sdk.currentUser?.userId) {
        setMessageToReply(undefined);
      }
    },
    onTypingStatusUpdated(eventChannel) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (!enableTypingIndicator) return;
      setTypingUsers(eventChannel.getTypingUsers());
    },
  });

  return (
    <ProviderLayout>
      <GroupChannelContexts.Fragment.Provider
        value={{
          headerTitle: STRINGS.GROUP_CHANNEL.HEADER_TITLE(currentUser?.userId ?? '', channel),
          channel,
          keyboardAvoidOffset,
          messageToEdit,
          setMessageToEdit: useCallback((message) => updateInputMode('edit', message), []),
          messageToReply,
          setMessageToReply: useCallback((message) => onPressMessageToReply(message), []),
        }}
      >
        <GroupChannelContexts.PubSub.Provider value={groupChannelPubSub}>
          <GroupChannelContexts.TypingIndicator.Provider value={{ typingUsers }}>
            <GroupChannelContexts.MessageList.Provider
              value={{
                flatListRef,
                scrollToMessage,
                lazyScrollToIndex,
                lazyScrollToBottom,
                onPressReplyMessageInThread,
              }}
            >
              {children}
            </GroupChannelContexts.MessageList.Provider>
          </GroupChannelContexts.TypingIndicator.Provider>
        </GroupChannelContexts.PubSub.Provider>
      </GroupChannelContexts.Fragment.Provider>
    </ProviderLayout>
  );
};

type MessageListContextValue = ContextValue<GroupChannelContextsType['MessageList']>;
const useScrollActions = (params: Pick<GroupChannelProps['Provider'], 'messages' | 'onUpdateSearchItem'>) => {
  const { messages, onUpdateSearchItem } = params;
  const flatListRef = useRef<FlatList<SendbirdMessage>>(null);

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToBottom = useFreshCallback<MessageListContextValue['lazyScrollToIndex']>((params) => {
    if (!flatListRef.current) {
      logFlatListRefWarning();
      return;
    }

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: params?.animated ?? false });
    }, params?.timeout ?? 0);
  });

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToIndex = useFreshCallback<MessageListContextValue['lazyScrollToIndex']>((params) => {
    if (!flatListRef.current) {
      logFlatListRefWarning();
      return;
    }

    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: params?.index ?? 0,
        animated: params?.animated ?? false,
        viewPosition: params?.viewPosition ?? 0.5,
      });
    }, params?.timeout ?? 0);
  });

  const scrollToMessage = useFreshCallback<MessageListContextValue['scrollToMessage']>((messageId, options) => {
    if (!flatListRef.current) {
      logFlatListRefWarning();
      return false;
    }

    const foundMessageIndex = messages.findIndex((it) => it.messageId === messageId);
    const isIncludedInList = foundMessageIndex > -1;

    if (isIncludedInList) {
      if (options?.focusAnimated) {
        setTimeout(
          () => onUpdateSearchItem({ startingPoint: messages[foundMessageIndex].createdAt }),
          MESSAGE_FOCUS_ANIMATION_DELAY,
        );
      }
      lazyScrollToIndex({
        index: foundMessageIndex,
        animated: true,
        timeout: 0,
        viewPosition: options?.viewPosition,
      });
      return true;
    } else {
      return false;
    }
  });

  return {
    flatListRef,
    lazyScrollToIndex,
    lazyScrollToBottom,
    scrollToMessage,
  };
};

const logFlatListRefWarning = () => {
  Logger.warn(
    'Cannot find flatListRef.current, please render FlatList and pass the flatListRef' +
      'or please try again after FlatList has been rendered.',
  );
};
