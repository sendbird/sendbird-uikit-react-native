import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelBannedUsersContexts } from '../module/moduleContext';
import type { OpenChannelBannedUsersProps } from '../types';

const OpenChannelBannedUsersHeader = ({ onPressHeaderLeft }: OpenChannelBannedUsersProps['Header']) => {
  const { headerTitle } = useContext(OpenChannelBannedUsersContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} left={<Icon icon={'arrow-left'} />} onPressLeft={onPressHeaderLeft} />;
};

export default OpenChannelBannedUsersHeader;
