import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelContexts } from '../module/moduleContext';
import type { OpenChannelProps } from '../types';

const OpenChannelHeader = ({ onPressHeaderLeft, onPressHeaderRight, rightIconName }: OpenChannelProps['Header']) => {
  const { headerTitle } = useContext(OpenChannelContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();

  return (
    <HeaderComponent
      title={headerTitle}
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon icon={rightIconName} />}
      onPressRight={onPressHeaderRight}
    />
  );
};

export default React.memo(OpenChannelHeader);
