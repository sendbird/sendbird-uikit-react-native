import React, { useContext } from 'react';

import { Icon, Text, useHeaderStyle, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelSettingsContexts } from '../module/moduleContext';
import type { GroupChannelSettingsProps } from '../types';

const GroupChannelSettingsHeader: React.FC<GroupChannelSettingsProps['Header']> = ({ onPressHeaderLeft }) => {
  const { colors } = useUIKitTheme();
  const { headerTitle, headerRight, onPressHeaderRight } = useContext(GroupChannelSettingsContexts.Fragment);

  const { HeaderComponent } = useHeaderStyle();

  return (
    <HeaderComponent
      title={headerTitle}
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={
        <Text button color={colors.primary}>
          {headerRight}
        </Text>
      }
      onPressRight={onPressHeaderRight}
    />
  );
};

export default GroupChannelSettingsHeader;
