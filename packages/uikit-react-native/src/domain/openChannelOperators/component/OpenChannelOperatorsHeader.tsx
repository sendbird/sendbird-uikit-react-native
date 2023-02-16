import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelOperatorsContexts } from '../module/moduleContext';
import type { OpenChannelOperatorsProps } from '../types';

const OpenChannelOperatorsHeader = ({ onPressHeaderLeft, onPressHeaderRight }: OpenChannelOperatorsProps['Header']) => {
  const { headerTitle } = useContext(OpenChannelOperatorsContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return (
    <HeaderComponent
      title={headerTitle}
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon icon={'plus'} />}
      onPressRight={onPressHeaderRight}
    />
  );
};

export default OpenChannelOperatorsHeader;
