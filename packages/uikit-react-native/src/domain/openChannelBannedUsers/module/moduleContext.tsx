import React, { createContext } from 'react';

import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { OpenChannelBannedUsersContextsType, OpenChannelBannedUsersModule } from '../types';

export const OpenChannelBannedUsersContexts: OpenChannelBannedUsersContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdOpenChannel,
  }),
};

export const OpenChannelBannedUsersContextsProvider: OpenChannelBannedUsersModule['Provider'] = ({
  channel,
  children,
}) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <OpenChannelBannedUsersContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.OPEN_CHANNEL_BANNED_USERS.HEADER_TITLE, channel }}
      >
        {children}
      </OpenChannelBannedUsersContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
