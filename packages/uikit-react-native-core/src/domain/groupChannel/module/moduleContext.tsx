import React, { createContext } from 'react';

import type { GroupChannelContextType } from '../types';

export const GroupChannelContext = createContext<GroupChannelContextType>({
  fragment: { headerTitle: '' },
});

export const GroupChannelContextProvider: React.FC = ({ children }) => {
  // const [visible, setVisible] = useState(false);

  return (
    <GroupChannelContext.Provider value={{ fragment: { headerTitle: 'LABEL.DOMAIN.HEADER_TITLE' } }}>
      {children}
    </GroupChannelContext.Provider>
  );
};
