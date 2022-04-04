import React, { createContext, useState } from 'react';
import type Sendbird from 'sendbird';

import { useChannelHandler } from '@sendbird/chat-react-hooks';
import { EmptyFunction, isDifferentChannel, useUniqId } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import type { GroupChannelContextType, GroupChannelModule } from '../types';

export const GroupChannelContext: GroupChannelContextType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as Sendbird.GroupChannel,
    setEditMessage: EmptyFunction,
  }),
  TypingIndicator: createContext({
    typingUsers: [] as Sendbird.User[],
  }),
};

export const GroupChannelContextProvider: GroupChannelModule['Provider'] = ({
  children,
  channel,
  enableTypingIndicator,
}) => {
  if (!channel) throw new Error('GroupChannel is not provided to GroupChannelModule');

  const id = useUniqId('GroupChannelContextProvider');
  const { LABEL } = useLocalization();
  const { currentUser, sdk } = useSendbirdChat();

  const [typingUsers, setTypingUsers] = useState<Sendbird.User[]>([]);
  const [editMessage, setEditMessage] = useState<Sendbird.UserMessage | Sendbird.FileMessage>();

  useChannelHandler(
    sdk,
    `GroupChannelContextProvider_${id}`,
    {
      onTypingStatusUpdated(eventChannel) {
        if (isDifferentChannel(channel, eventChannel) && !enableTypingIndicator) return;
        const usersWithoutMe = eventChannel.getTypingUsers().filter((u) => u.userId !== currentUser?.userId);
        setTypingUsers(usersWithoutMe);
      },
    },
    [channel, currentUser?.userId, enableTypingIndicator],
  );

  return (
    <ProviderLayout>
      <GroupChannelContext.Fragment.Provider
        value={{
          headerTitle: LABEL.GROUP_CHANNEL.HEADER_TITLE(currentUser?.userId ?? '', channel),
          channel,
          editMessage,
          setEditMessage,
        }}
      >
        <GroupChannelContext.TypingIndicator.Provider value={{ typingUsers }}>
          {children}
        </GroupChannelContext.TypingIndicator.Provider>
      </GroupChannelContext.Fragment.Provider>
    </ProviderLayout>
  );
};
