import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import type { UIKitColors, UIKitPalette } from '@sendbird/uikit-react-native-foundation';
import { isFunction } from '@sendbird/uikit-utils';

import useUIKitTheme from '../../theme/useUIKitTheme';

type BaseBoxProps = Pick<
  ViewStyle,
  | 'flex'
  | 'flexShrink'
  | 'flexGrow'
  | 'flexDirection'
  | 'alignItems'
  | 'justifyContent'
  | 'borderRadius'
  | 'margin'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'marginLeft'
  | 'marginRight'
  | 'marginTop'
  | 'marginBottom'
  | 'padding'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingTop'
  | 'paddingBottom'
  | 'overflow'
> & {
  backgroundColor?: string | ((theme: { colors: UIKitColors; palette: UIKitPalette }) => string);
};

type BoxProps = BaseBoxProps & ViewProps;
const Box = ({ style, children, ...props }: BoxProps) => {
  const boxStyle = useBoxStyle(props);

  return (
    <View style={StyleSheet.flatten([boxStyle, style])} {...props}>
      {children}
    </View>
  );
};

const useBoxStyle = (props: BaseBoxProps): StyleProp<ViewStyle> => {
  const theme = useUIKitTheme();

  const { backgroundColor, ...rest } = props;

  return {
    backgroundColor: isFunction(backgroundColor) ? backgroundColor(theme) : backgroundColor,
    ...rest,
  };
};

export default Box;
