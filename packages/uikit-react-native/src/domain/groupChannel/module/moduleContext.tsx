import React, { createContext, useState } from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import {
  NOOP,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdUser,
  SendbirdUserMessage,
  isDifferentChannel,
  useUniqId,
} from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import type { GroupChannelContextsType, GroupChannelModule } from '../types';

export const GroupChannelContexts: GroupChannelContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdGroupChannel,
    setMessageToEdit: NOOP,
  }),
  TypingIndicator: createContext({
    typingUsers: [] as SendbirdUser[],
  }),
};

export const GroupChannelContextsProvider: GroupChannelModule['Provider'] = ({
  children,
  channel,
  enableTypingIndicator,
  keyboardAvoidOffset = 0,
}) => {
  if (!channel) throw new Error('GroupChannel is not provided to GroupChannelModule');

  const id = useUniqId('GroupChannelContextsProvider');
  const { STRINGS } = useLocalization();
  const { currentUser, sdk } = useSendbirdChat();

  const [typingUsers, setTypingUsers] = useState<SendbirdUser[]>([]);
  const [messageToEdit, setMessageToEdit] = useState<SendbirdUserMessage | SendbirdFileMessage>();

  useChannelHandler(sdk, `GroupChannelContextsProvider_${id}`, {
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
          messageToEdit,
          setMessageToEdit,
          keyboardAvoidOffset,
        }}
      >
        <GroupChannelContexts.TypingIndicator.Provider value={{ typingUsers }}>
          {children}
        </GroupChannelContexts.TypingIndicator.Provider>
      </GroupChannelContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
