import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelMutedMembersContexts } from '../module/moduleContext';
import type { GroupChannelMutedMembersProps } from '../types';

const GroupChannelMutedMembersHeader = ({ onPressHeaderLeft }: GroupChannelMutedMembersProps['Header']) => {
  const { headerTitle } = useContext(GroupChannelMutedMembersContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} left={<Icon icon={'arrow-left'} />} onPressLeft={onPressHeaderLeft} />;
};

export default GroupChannelMutedMembersHeader;
