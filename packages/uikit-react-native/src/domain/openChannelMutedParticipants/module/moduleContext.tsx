import React, { createContext } from 'react';

import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { OpenChannelMutedParticipantsContextsType, OpenChannelMutedParticipantsModule } from '../types';

export const OpenChannelMutedParticipantsContexts: OpenChannelMutedParticipantsContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdOpenChannel,
  }),
};

export const OpenChannelMutedParticipantsContextsProvider: OpenChannelMutedParticipantsModule['Provider'] = ({
  children,
  channel,
}) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <OpenChannelMutedParticipantsContexts.Fragment.Provider
        value={{ channel, headerTitle: STRINGS.OPEN_CHANNEL_MUTED_PARTICIPANTS.HEADER_TITLE }}
      >
        {children}
      </OpenChannelMutedParticipantsContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
