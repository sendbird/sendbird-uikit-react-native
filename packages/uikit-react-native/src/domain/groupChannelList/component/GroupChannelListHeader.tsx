import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelListContexts } from '../module/moduleContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListHeader = (_: GroupChannelListProps['Header']) => {
  const fragment = useContext(GroupChannelListContexts.Fragment);
  const typeSelector = useContext(GroupChannelListContexts.TypeSelector);
  const { HeaderComponent } = useHeaderStyle();

  return (
    <HeaderComponent title={fragment.headerTitle} right={<Icon icon={'create'} />} onPressRight={typeSelector.show} />
  );
};

export default GroupChannelListHeader;
