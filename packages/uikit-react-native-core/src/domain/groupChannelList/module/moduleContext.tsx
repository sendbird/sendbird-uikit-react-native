import React, { createContext, useCallback, useState } from 'react';
import type Sendbird from 'sendbird';

import { NOOP } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../contexts/Localization';
import type { GroupChannelListContextType } from '../types';

export const GroupChannelListContext: GroupChannelListContextType = {
  Fragment: createContext({
    headerTitle: '',
  }),
  TypeSelector: createContext({
    headerTitle: '',
    visible: Boolean(),
    hide: NOOP,
    show: NOOP,
  }),
  ChannelMenu: createContext({
    selectChannel: NOOP,
  }),
};

export const GroupChannelListContextProvider: React.FC = ({ children }) => {
  const { STRINGS } = useLocalization();

  // Type selector
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  // Channel menu
  const [selectedChannel, selectChannel] = useState<Sendbird.GroupChannel>();

  return (
    <ProviderLayout>
      <GroupChannelListContext.TypeSelector.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_LIST.TYPE_SELECTOR_HEADER_TITLE, visible, show, hide }}
      >
        <GroupChannelListContext.Fragment.Provider value={{ headerTitle: STRINGS.GROUP_CHANNEL_LIST.HEADER_TITLE }}>
          <GroupChannelListContext.ChannelMenu.Provider value={{ selectChannel, selectedChannel }}>
            {children}
          </GroupChannelListContext.ChannelMenu.Provider>
        </GroupChannelListContext.Fragment.Provider>
      </GroupChannelListContext.TypeSelector.Provider>
    </ProviderLayout>
  );
};
