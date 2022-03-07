import React, { useContext } from 'react';

import { Header as DefaultHeader, Icon } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelListContext } from '../module/moduleContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListHeader: React.FC<GroupChannelListProps['Header']> = ({ Header = DefaultHeader, children }) => {
  const fragment = useContext(GroupChannelListContext.Fragment);
  const typeSelector = useContext(GroupChannelListContext.TypeSelector);
  if (!Header) return null;
  return (
    <Header title={fragment.headerTitle} right={<Icon icon={'create'} />} onPressRight={typeSelector.show}>
      {children}
    </Header>
  );
};

export default GroupChannelListHeader;
