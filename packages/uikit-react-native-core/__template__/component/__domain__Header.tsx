import React, { useContext } from 'react';

import { Header as DefaultHeader } from '@sendbird/uikit-react-native-foundation';

import { __domain__Context } from '../module/moduleContext';
import type { __domain__Props } from '../types';

const __domain__Header: React.FC<__domain__Props['Header']> = ({ Header = DefaultHeader }) => {
  const { fragment } = useContext(__domain__Context);
  if (!Header) return null;
  return <Header title={fragment.headerTitle} />;
};

export default __domain__Header;
