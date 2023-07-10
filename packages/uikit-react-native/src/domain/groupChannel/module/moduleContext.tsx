import React, { createContext, useCallback, useState } from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import {
  NOOP,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdUser,
  SendbirdUserMessage,
  isDifferentChannel,
  useUniqHandlerId,
} from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import type { PubSub } from '../../../utils/pubsub';
import type { GroupChannelContextsType, GroupChannelModule, GroupChannelPubSubContextPayload } from '../types';

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
};

export const GroupChannelContextsProvider: GroupChannelModule['Provider'] = ({
  children,
  channel,
  enableTypingIndicator,
  keyboardAvoidOffset = 0,
  groupChannelPubSub,
}) => {
  if (!channel) throw new Error('GroupChannel is not provided to GroupChannelModule');

  const handlerId = useUniqHandlerId('GroupChannelContextsProvider');
  const { STRINGS } = useLocalization();
  const { currentUser, sdk } = useSendbirdChat();

  const [typingUsers, setTypingUsers] = useState<SendbirdUser[]>([]);
  const [messageToEdit, setMessageToEdit] = useState<SendbirdUserMessage | SendbirdFileMessage>();
  const [messageToReply, setMessageToReply] = useState<SendbirdUserMessage | SendbirdFileMessage>();

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

  useChannelHandler(sdk, handlerId, {
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
          setMessageToReply: useCallback((message) => updateInputMode('reply', message), []),
        }}
      >
        <GroupChannelContexts.TypingIndicator.Provider value={{ typingUsers }}>
          <GroupChannelContexts.PubSub.Provider value={groupChannelPubSub}>
            {children}
          </GroupChannelContexts.PubSub.Provider>
        </GroupChannelContexts.TypingIndicator.Provider>
      </GroupChannelContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
