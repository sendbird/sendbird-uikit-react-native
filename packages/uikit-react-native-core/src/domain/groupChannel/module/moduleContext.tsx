import React, { createContext, useState } from 'react';
import type Sendbird from 'sendbird';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { NOOP, isDifferentChannel, useUniqId } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import type { GroupChannelContextsType, GroupChannelModule } from '../types';

export const GroupChannelContexts: GroupChannelContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as Sendbird.GroupChannel,
    setEditMessage: NOOP,
  }),
  TypingIndicator: createContext({
    typingUsers: [] as Sendbird.User[],
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

  const [typingUsers, setTypingUsers] = useState<Sendbird.User[]>([]);
  const [editMessage, setEditMessage] = useState<Sendbird.UserMessage | Sendbird.FileMessage>();

  useChannelHandler(
    sdk,
    `GroupChannelContextsProvider_${id}`,
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
      <GroupChannelContexts.Fragment.Provider
        value={{
          headerTitle: STRINGS.GROUP_CHANNEL.HEADER_TITLE(currentUser?.userId ?? '', channel),
          channel,
          editMessage,
          setEditMessage,
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
