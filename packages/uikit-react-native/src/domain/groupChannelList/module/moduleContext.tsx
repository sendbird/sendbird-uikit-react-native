import React, { createContext, useCallback, useState } from 'react';

import { NOOP } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelListContextsType, GroupChannelListModule } from '../types';

export const GroupChannelListContexts: GroupChannelListContextsType = {
  Fragment: createContext({
    headerTitle: '',
  }),
  TypeSelector: createContext({
    headerTitle: '',
    visible: Boolean(),
    hide: NOOP,
    show: NOOP,
  }),
};

export const GroupChannelListContextsProvider: GroupChannelListModule['Provider'] = ({ children }) => {
  const { STRINGS } = useLocalization();

  // Type selector
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  return (
    <ProviderLayout>
      <GroupChannelListContexts.TypeSelector.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_LIST.TYPE_SELECTOR_HEADER_TITLE, visible, show, hide }}
      >
        <GroupChannelListContexts.Fragment.Provider value={{ headerTitle: STRINGS.GROUP_CHANNEL_LIST.HEADER_TITLE }}>
          {children}
        </GroupChannelListContexts.Fragment.Provider>
      </GroupChannelListContexts.TypeSelector.Provider>
    </ProviderLayout>
  );
};
