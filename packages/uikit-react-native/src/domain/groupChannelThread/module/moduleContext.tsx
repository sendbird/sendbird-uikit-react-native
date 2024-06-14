import React, { createContext, useRef, useState } from 'react';
import type { FlatList } from 'react-native';

import {
  ContextValue,
  Logger,
  NOOP,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdUserMessage,
  useFreshCallback,
} from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { PubSub } from '../../../utils/pubsub';
import type {
  GroupChannelThreadContextsType,
  GroupChannelThreadModule,
  GroupChannelThreadPubSubContextPayload,
} from '../types';
import { GroupChannelThreadProps } from '../types';

export const GroupChannelThreadContexts: GroupChannelThreadContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdGroupChannel,
    parentMessage: {} as SendbirdUserMessage | SendbirdFileMessage,
    setMessageToEdit: NOOP,
  }),
  PubSub: createContext({
    publish: NOOP,
    subscribe: () => NOOP,
  } as PubSub<GroupChannelThreadPubSubContextPayload>),
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

export const GroupChannelThreadContextsProvider: GroupChannelThreadModule['Provider'] = ({
  children,
  channel,
  parentMessage,
  keyboardAvoidOffset = 0,
  groupChannelThreadPubSub,
  threadedMessages,
}) => {
  if (!channel) throw new Error('GroupChannel is not provided to GroupChannelThreadModule');

  const { STRINGS } = useLocalization();
  const [messageToEdit, setMessageToEdit] = useState<SendbirdUserMessage | SendbirdFileMessage>();
  const { flatListRef, lazyScrollToIndex, lazyScrollToBottom, scrollToMessage } = useScrollActions({
    threadedMessages: threadedMessages,
  });

  return (
    <ProviderLayout>
      <GroupChannelThreadContexts.Fragment.Provider
        value={{
          headerTitle: STRINGS.GROUP_CHANNEL_THREAD.HEADER_TITLE,
          channel,
          parentMessage,
          keyboardAvoidOffset,
          messageToEdit: messageToEdit,
          setMessageToEdit,
        }}
      >
        <GroupChannelThreadContexts.PubSub.Provider value={groupChannelThreadPubSub}>
          <GroupChannelThreadContexts.MessageList.Provider
            value={{
              flatListRef,
              scrollToMessage,
              lazyScrollToIndex,
              lazyScrollToBottom,
            }}
          >
            {children}
          </GroupChannelThreadContexts.MessageList.Provider>
        </GroupChannelThreadContexts.PubSub.Provider>
      </GroupChannelThreadContexts.Fragment.Provider>
    </ProviderLayout>
  );
};

type MessageListContextValue = ContextValue<GroupChannelThreadContextsType['MessageList']>;
const useScrollActions = (params: Pick<GroupChannelThreadProps['Provider'], 'threadedMessages'>) => {
  const { threadedMessages } = params;
  const flatListRef = useRef<FlatList<SendbirdMessage>>(null);

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToBottom = useFreshCallback<MessageListContextValue['lazyScrollToIndex']>((params) => {
    if (!flatListRef.current) {
      logFlatListRefWarning();
      return;
    }

    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: params?.animated ?? false });
      }
    }, params?.timeout ?? 0);
  });

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToIndex = useFreshCallback<MessageListContextValue['lazyScrollToIndex']>((params) => {
    if (!flatListRef.current) {
      logFlatListRefWarning();
      return;
    }

    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: params?.index ?? 0,
          animated: params?.animated ?? false,
          viewPosition: params?.viewPosition ?? 0.5,
        });
      }
    }, params?.timeout ?? 0);
  });

  const scrollToMessage = useFreshCallback<MessageListContextValue['scrollToMessage']>((messageId, options) => {
    if (!flatListRef.current) {
      logFlatListRefWarning();
      return false;
    }

    const foundMessageIndex = threadedMessages.findIndex((it) => it.messageId === messageId);
    const isIncludedInList = foundMessageIndex > -1;

    if (isIncludedInList) {
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
