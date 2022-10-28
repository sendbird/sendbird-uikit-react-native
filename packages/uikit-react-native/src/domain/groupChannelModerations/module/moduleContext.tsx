import React, { createContext } from 'react';

import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelModerationsContextsType, GroupChannelModerationsModule } from '../types';

export const GroupChannelModerationsContexts: GroupChannelModerationsContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdGroupChannel,
  }),
};

export const GroupChannelModerationsContextsProvider: GroupChannelModerationsModule['Provider'] = ({
  children,
  channel,
}) => {
  // const [visible, setVisible] = useState(false);

  const { STRINGS } = useLocalization();

  return (
    <ProviderLayout>
      <GroupChannelModerationsContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_MODERATIONS.HEADER_TITLE, channel }}
      >
        {children}
      </GroupChannelModerationsContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
