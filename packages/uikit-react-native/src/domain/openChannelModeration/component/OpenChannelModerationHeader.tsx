import React, { useContext } from 'react';

import { useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelModerationContexts } from '../module/moduleContext';
import type { OpenChannelModerationProps } from '../types';

const OpenChannelModerationHeader = (_: OpenChannelModerationProps['Header']) => {
  const { headerTitle } = useContext(OpenChannelModerationContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} />;
};

export default OpenChannelModerationHeader;
