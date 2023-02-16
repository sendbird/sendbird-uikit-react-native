import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelModerationContexts } from '../module/moduleContext';
import type { OpenChannelModerationProps } from '../types';

const OpenChannelModerationHeader = ({ onPressHeaderLeft }: OpenChannelModerationProps['Header']) => {
  const { headerTitle } = useContext(OpenChannelModerationContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();

  return <HeaderComponent title={headerTitle} left={<Icon icon={'arrow-left'} />} onPressLeft={onPressHeaderLeft} />;
};

export default OpenChannelModerationHeader;
