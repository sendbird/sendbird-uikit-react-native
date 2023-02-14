import React, { createContext } from 'react';

import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { OpenChannelModerationContextsType, OpenChannelModerationModule } from '../types';

export const OpenChannelModerationContexts: OpenChannelModerationContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdOpenChannel,
  }),
};

export const OpenChannelModerationContextsProvider: OpenChannelModerationModule['Provider'] = ({
  children,
  channel,
}) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <OpenChannelModerationContexts.Fragment.Provider
        value={{
          headerTitle: STRINGS.OPEN_CHANNEL_MODERATION.HEADER_TITLE,
          channel,
        }}
      >
        {children}
      </OpenChannelModerationContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
