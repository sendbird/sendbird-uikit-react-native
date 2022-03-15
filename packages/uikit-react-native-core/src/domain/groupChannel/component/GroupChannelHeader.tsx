import React, { useContext } from 'react';

import { Header as DefaultHeader } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelContext } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelHeader: React.FC<GroupChannelProps['Header']> = ({ Header = DefaultHeader }) => {
  const { fragment } = useContext(GroupChannelContext);
  if (!Header) return null;
  return <Header title={fragment.headerTitle} />;
};

export default GroupChannelHeader;
