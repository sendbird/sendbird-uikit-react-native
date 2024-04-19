import React, { useContext } from 'react';

import { Icon, Text, useHeaderStyle, useUIKitTheme } from '@gathertown/uikit-react-native-foundation';
import { ifThenOr } from '@gathertown/uikit-utils';

import { OpenChannelCreateContexts } from '../module/moduleContext';
import type { OpenChannelCreateProps } from '../types';

const OpenChannelCreateHeader = ({
  onPressHeaderLeft,
  onPressHeaderRight,
  shouldActivateHeaderRight,
}: OpenChannelCreateProps['Header']) => {
  const { headerTitle, headerRight } = useContext(OpenChannelCreateContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  const { colors } = useUIKitTheme();

  const isHeaderRightActive = shouldActivateHeaderRight();

  return (
    <HeaderComponent
      title={headerTitle}
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={
        <Text button color={ifThenOr(isHeaderRightActive, colors.primary, colors.onBackground04)}>
          {headerRight}
        </Text>
      }
      onPressRight={ifThenOr(isHeaderRightActive, onPressHeaderRight)}
    />
  );
};

export default OpenChannelCreateHeader;
