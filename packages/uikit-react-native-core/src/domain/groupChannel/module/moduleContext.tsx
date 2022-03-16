import React, { createContext } from 'react';

import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import type { GroupChannelContextType, GroupChannelModule } from '../types';

export const GroupChannelContext: GroupChannelContextType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as any,
  }),
};

export const GroupChannelContextProvider: GroupChannelModule['Provider'] = ({ children, channel }) => {
  const { LABEL } = useLocalization();
  const { currentUser } = useSendbirdChat();
  if (!channel) throw new Error('GroupChannel is not provided to GroupChannelModule');

  return (
    <GroupChannelContext.Fragment.Provider
      value={{ headerTitle: LABEL.GROUP_CHANNEL.FRAGMENT.HEADER_TITLE(currentUser?.userId ?? '', channel), channel }}
    >
      {children}
    </GroupChannelContext.Fragment.Provider>
  );
};
