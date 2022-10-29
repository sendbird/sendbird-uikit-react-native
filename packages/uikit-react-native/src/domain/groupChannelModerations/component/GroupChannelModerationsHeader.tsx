import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelModerationsContexts } from '../module/moduleContext';
import type { GroupChannelModerationsProps } from '../types';

const GroupChannelModerationsHeader = ({ onPressHeaderLeft }: GroupChannelModerationsProps['Header']) => {
  const { headerTitle } = useContext(GroupChannelModerationsContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} left={<Icon icon={'arrow-left'} />} onPressLeft={onPressHeaderLeft} />;
};

export default GroupChannelModerationsHeader;
