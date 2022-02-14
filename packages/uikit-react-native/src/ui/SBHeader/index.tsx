import React from 'react';
import { FlexAlignType, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-core';

import getDefaultHeaderHeight from '../../styles/getDefaultHeaderHeight';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import SBText from '../SBText';

const SBHeader: React.FC<
  BaseHeaderProps<{
    left: React.ReactElement | null;
    title: string | React.ReactElement | null;
    right: React.ReactElement | null;
  }>
> = ({ titleAlign = 'left', left, title, right }) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { colors } = useUIKitTheme();

  const TOP_INSET = statusBarTranslucent ? top : 0;
  // if (!title && !left && !right) return null;
  return (
    <View
      style={{
        height: getDefaultHeaderHeight(width > height) + TOP_INSET,
        paddingTop: TOP_INSET,
        paddingHorizontal: 12,
        backgroundColor: colors.background,
        flexDirection: 'row',
        borderBottomColor: colors.onBackground04,
        borderBottomWidth: 1,
      }}
    >
      {left && (
        <View
          style={{
            height: '100%',
            minWidth: 32,
            padding: 4,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          {left}
        </View>
      )}
      <View
        style={{
          flex: 1,
          marginHorizontal: 12,
          justifyContent: 'center',
          alignItems: { left: 'flex-start', center: 'center', right: 'flex-end' }[titleAlign] as FlexAlignType,
        }}
      >
        {typeof title === 'string' ? <SBText h1>{title}</SBText> : { title }}
      </View>
      {right && (
        <View
          style={{
            height: '100%',
            minWidth: 32,
            padding: 4,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}
        >
          {right}
        </View>
      )}
    </View>
  );
};

export default SBHeader;
