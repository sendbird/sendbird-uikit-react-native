import React, { createContext } from 'react';

import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { OpenChannelOperatorsContextsType, OpenChannelOperatorsModule } from '../types';

export const OpenChannelOperatorsContexts: OpenChannelOperatorsContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdOpenChannel,
  }),
};

export const OpenChannelOperatorsContextsProvider: OpenChannelOperatorsModule['Provider'] = ({ children, channel }) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <OpenChannelOperatorsContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.OPEN_CHANNEL_OPERATORS.HEADER_TITLE, channel }}
      >
        {children}
      </OpenChannelOperatorsContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
