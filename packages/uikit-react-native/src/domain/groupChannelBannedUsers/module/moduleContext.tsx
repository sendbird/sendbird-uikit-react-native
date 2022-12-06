import React, { createContext } from 'react';

import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelBannedUsersContextsType, GroupChannelBannedUsersModule } from '../types';

export const GroupChannelBannedUsersContexts: GroupChannelBannedUsersContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdGroupChannel,
  }),
};

export const GroupChannelBannedUsersContextsProvider: GroupChannelBannedUsersModule['Provider'] = ({
  channel,
  children,
}) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <GroupChannelBannedUsersContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_BANNED_USERS.HEADER_TITLE, channel }}
      >
        {children}
      </GroupChannelBannedUsersContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
