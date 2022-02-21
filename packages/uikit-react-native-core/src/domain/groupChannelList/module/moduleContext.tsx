import React, { createContext, useCallback, useState } from 'react';

import { EmptyFunction } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import type { GroupChannelListContextType } from '../types';

export const GroupChannelListContext = createContext<GroupChannelListContextType>({
  fragment: { headerTitle: '' },
  typeSelector: {
    headerTitle: '',
    visible: false,
    hide: EmptyFunction,
    show: EmptyFunction,
  },
});

export const GroupChannelListContextProvider: React.FC = ({ children }) => {
  const { LABEL } = useLocalization();
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  return (
    <GroupChannelListContext.Provider
      value={{
        fragment: { headerTitle: LABEL.GROUP_CHANNEL_LIST.FRAGMENT.HEADER_TITLE },
        typeSelector: { headerTitle: LABEL.GROUP_CHANNEL_LIST.TYPE_SELECTOR.HEADER_TITLE, visible, show, hide },
      }}
    >
      {children}
    </GroupChannelListContext.Provider>
  );
};
