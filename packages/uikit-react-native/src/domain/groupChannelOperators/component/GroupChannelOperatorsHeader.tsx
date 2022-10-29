import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelOperatorsContexts } from '../module/moduleContext';
import type { GroupChannelOperatorsProps } from '../types';

const GroupChannelOperatorsHeader = ({
  onPressHeaderLeft,
  onPressHeaderRight,
}: GroupChannelOperatorsProps['Header']) => {
  const { headerTitle } = useContext(GroupChannelOperatorsContexts.Fragment);
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

export default GroupChannelOperatorsHeader;
