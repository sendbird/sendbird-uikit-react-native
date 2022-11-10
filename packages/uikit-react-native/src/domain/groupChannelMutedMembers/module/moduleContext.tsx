import React, { createContext } from 'react';

import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelMutedMembersContextsType, GroupChannelMutedMembersModule } from '../types';

export const GroupChannelMutedMembersContexts: GroupChannelMutedMembersContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdGroupChannel,
  }),
};

export const GroupChannelMutedMembersContextsProvider: GroupChannelMutedMembersModule['Provider'] = ({
  channel,
  children,
}) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <GroupChannelMutedMembersContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_MUTED_MEMBERS.HEADER_TITLE, channel }}
      >
        {children}
      </GroupChannelMutedMembersContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
