import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelListContexts } from '../module/moduleContext';
import type { OpenChannelListProps } from '../types';

const OpenChannelListHeader = ({ onPressHeaderRight }: OpenChannelListProps['Header']) => {
  const { headerTitle } = useContext(OpenChannelListContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} right={<Icon icon={'create'} />} onPressRight={onPressHeaderRight} />;
};

export default OpenChannelListHeader;
