import React, { createContext } from 'react';

import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelModerationContextsType, GroupChannelModerationModule } from '../types';

export const GroupChannelModerationContexts: GroupChannelModerationContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdGroupChannel,
  }),
};

export const GroupChannelModerationContextsProvider: GroupChannelModerationModule['Provider'] = ({
  children,
  channel,
}) => {
  // const [visible, setVisible] = useState(false);

  const { STRINGS } = useLocalization();

  return (
    <ProviderLayout>
      <GroupChannelModerationContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_MODERATION.HEADER_TITLE, channel }}
      >
        {children}
      </GroupChannelModerationContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
