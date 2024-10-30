import React from 'react';
import { I18nManager, Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';

import useUIKitTheme from '../../theme/useUIKitTheme';
import type { TypoName, UIKitTheme } from '../../types';
import { isStartsWithRTL } from './isStartsWithRTL';

type TypographyProps = Partial<Record<TypoName, boolean>>;
export type TextProps = RNTextProps &
  TypographyProps & {
    color?: ((colors: UIKitTheme['colors']) => string) | string;
  } & {
    supportRTLAlign?: boolean;
    originalText?: string;
  };

const Text = ({ children, color, style, supportRTLAlign, originalText, ...props }: TextProps) => {
  const { colors } = useUIKitTheme();
  const typoStyle = useTypographyFilter(props);

  const textStyle = StyleSheet.flatten([
    { color: typeof color === 'string' ? color : color?.(colors) ?? colors.text },
    typoStyle,
    style,
  ]) as TextStyle;

  const textAlign = (() => {
    if (I18nManager.isRTL && supportRTLAlign) {
      if (originalText && isStartsWithRTL(originalText)) {
        return I18nManager.doLeftAndRightSwapInRTL ? 'left' : 'right';
      }
    }
    if (textStyle.textAlign) return textStyle.textAlign;
    return undefined;
  })();

  return (
    <RNText style={[textStyle, { textAlign }]} {...props}>
      {children}
    </RNText>
  );
};

const useTypographyFilter = ({
  h1,
  h2,
  subtitle1,
  subtitle2,
  body1,
  body2,
  body3,
  button,
  caption1,
  caption2,
  caption3,
  caption4,
}: TypographyProps) => {
  const { typography } = useUIKitTheme();
  if (h1) return typography.h1;
  if (h2) return typography.h2;
  if (subtitle1) return typography.subtitle1;
  if (subtitle2) return typography.subtitle2;
  if (body1) return typography.body1;
  if (body2) return typography.body2;
  if (body3) return typography.body3;
  if (button) return typography.button;
  if (caption1) return typography.caption1;
  if (caption2) return typography.caption2;
  if (caption3) return typography.caption3;
  if (caption4) return typography.caption4;
  return {};
};

export default Text;
