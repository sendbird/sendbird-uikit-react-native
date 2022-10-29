import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelBannedUsersContexts } from '../module/moduleContext';
import type { GroupChannelBannedUsersProps } from '../types';

const GroupChannelBannedUsersHeader = ({ onPressHeaderLeft }: GroupChannelBannedUsersProps['Header']) => {
  const { headerTitle } = useContext(GroupChannelBannedUsersContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} left={<Icon icon={'arrow-left'} />} onPressLeft={onPressHeaderLeft} />;
};

export default GroupChannelBannedUsersHeader;
