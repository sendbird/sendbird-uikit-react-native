import React, { createContext, useCallback, useState } from 'react';
import type Sendbird from 'sendbird';

import { EmptyFunction } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import type { GroupChannelListContextType } from '../types';

export const GroupChannelListContext: GroupChannelListContextType = {
  Fragment: createContext({
    headerTitle: '',
  }),
  TypeSelector: createContext({
    headerTitle: '',
    visible: Boolean(),
    hide: EmptyFunction,
    show: EmptyFunction,
  }),
  ChannelMenu: createContext({
    selectChannel: EmptyFunction,
  }),
};

export const GroupChannelListContextProvider: React.FC = ({ children }) => {
  const { LABEL } = useLocalization();

  // Type selector
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  // Channel menu
  const [selectedChannel, selectChannel] = useState<Sendbird.GroupChannel>();

  return (
    <GroupChannelListContext.TypeSelector.Provider
      value={{ headerTitle: LABEL.GROUP_CHANNEL_LIST.TYPE_SELECTOR.HEADER_TITLE, visible, show, hide }}
    >
      <GroupChannelListContext.Fragment.Provider
        value={{ headerTitle: LABEL.GROUP_CHANNEL_LIST.FRAGMENT.HEADER_TITLE }}
      >
        <GroupChannelListContext.ChannelMenu.Provider value={{ selectChannel, selectedChannel }}>
          {children}
        </GroupChannelListContext.ChannelMenu.Provider>
      </GroupChannelListContext.Fragment.Provider>
    </GroupChannelListContext.TypeSelector.Provider>
  );
};
