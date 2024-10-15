import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import { isFunction } from '@sendbird/uikit-utils';

import useUIKitTheme from '../../theme/useUIKitTheme';
import type { UIKitColors, UIKitPalette } from '../../types';

type DeprecatedBoxProps = {
  /** @deprecated Please use `paddingStart` instead **/
  paddingLeft?: ViewStyle['paddingLeft'];
  /** @deprecated Please use `paddingEnd` instead **/
  paddingRight?: ViewStyle['paddingRight'];
  /** @deprecated Please use `marginStart` instead **/
  marginLeft?: ViewStyle['marginLeft'];
  /** @deprecated Please use `marginEnd` instead **/
  marginRight?: ViewStyle['marginRight'];
};

type BaseBoxProps = Pick<
  ViewStyle,
  | 'flex'
  | 'flexShrink'
  | 'flexGrow'
  | 'flexDirection'
  | 'alignItems'
  | 'justifyContent'
  | 'borderRadius'
  | 'borderWidth'
  | 'borderColor'
  | 'borderBottomColor'
  | 'borderBottomWidth'
  | 'margin'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'marginStart'
  | 'marginEnd'
  | 'marginTop'
  | 'marginBottom'
  | 'padding'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'paddingStart'
  | 'paddingEnd'
  | 'paddingTop'
  | 'paddingBottom'
  | 'overflow'
  | 'width'
  | 'height'
> & {
  backgroundColor?: string | ((theme: { colors: UIKitColors; palette: UIKitPalette }) => string);
};

type BoxProps = BaseBoxProps & DeprecatedBoxProps & ViewProps;
const Box = ({ style, children, ...props }: BoxProps) => {
  const boxStyle = useBoxStyle(props);

  return (
    <View {...props} style={[boxStyle, style]}>
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
