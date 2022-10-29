import React, { useContext } from 'react';

import { useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { __domain__Contexts } from '../module/moduleContext';
import type { __domain__Props } from '../types';

const __domain__Header = (_: __domain__Props['Header']) => {
  const { headerTitle } = useContext(__domain__Contexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} />;
};

export default __domain__Header;
