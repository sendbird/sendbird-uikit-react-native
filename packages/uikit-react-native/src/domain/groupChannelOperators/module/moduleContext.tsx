import React, { createContext } from 'react';

import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelOperatorsContextsType, GroupChannelOperatorsModule } from '../types';

export const GroupChannelOperatorsContexts: GroupChannelOperatorsContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdGroupChannel,
  }),
};

export const GroupChannelOperatorsContextsProvider: GroupChannelOperatorsModule['Provider'] = ({
  channel,
  children,
}) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <GroupChannelOperatorsContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_OPERATORS.HEADER_TITLE, channel }}
      >
        {children}
      </GroupChannelOperatorsContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
