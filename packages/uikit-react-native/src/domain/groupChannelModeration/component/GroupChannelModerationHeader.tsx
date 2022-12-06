import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelModerationContexts } from '../module/moduleContext';
import type { GroupChannelModerationProps } from '../types';

const GroupChannelModerationHeader = ({ onPressHeaderLeft }: GroupChannelModerationProps['Header']) => {
  const { headerTitle } = useContext(GroupChannelModerationContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} left={<Icon icon={'arrow-left'} />} onPressLeft={onPressHeaderLeft} />;
};

export default GroupChannelModerationHeader;
