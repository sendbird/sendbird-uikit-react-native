import React, { useContext } from 'react';

import { Header as DefaultHeader, Icon, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelInfoContext } from '../module/moduleContext';
import type { GroupChannelInfoProps } from '../types';

const GroupChannelInfoHeader: React.FC<GroupChannelInfoProps['Header']> = ({
  Header = DefaultHeader,
  onPressHeaderLeft,
}) => {
  const { colors } = useUIKitTheme();
  const { headerTitle, headerRight, onPressHeaderRight } = useContext(GroupChannelInfoContext.Fragment);
  if (!Header) return null;
  return (
    <Header
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

export default GroupChannelInfoHeader;
