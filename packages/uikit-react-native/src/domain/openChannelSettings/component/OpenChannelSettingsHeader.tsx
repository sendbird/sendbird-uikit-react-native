import React, { useContext } from 'react';

import { Icon, Text, useHeaderStyle, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelSettingsContexts } from '../module/moduleContext';
import type { OpenChannelSettingsProps } from '../types';

const OpenChannelSettingsHeader = ({ onPressHeaderLeft }: OpenChannelSettingsProps['Header']) => {
  const { colors } = useUIKitTheme();
  const { headerTitle, headerRight, onPressHeaderRight } = useContext(OpenChannelSettingsContexts.Fragment);

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

export default OpenChannelSettingsHeader;
