import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelNotificationsContexts } from '../module/moduleContext';
import type { GroupChannelNotificationsProps } from '../types';

const GroupChannelNotificationsHeader = ({ onPressHeaderLeft }: GroupChannelNotificationsProps['Header']) => {
  const { headerTitle } = useContext(GroupChannelNotificationsContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} left={<Icon icon={'arrow-left'} />} onPressLeft={onPressHeaderLeft} />;
};

export default GroupChannelNotificationsHeader;
