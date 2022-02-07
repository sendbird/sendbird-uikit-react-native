import React, { useMemo } from 'react';
import { Text, TextProps } from 'react-native';

import useUIKitTheme from '../../theme/useUIKitTheme';
import type { TypoName, UIKitTheme } from '../../types';

// TODO: check re-render performance

type TypographyProps = Partial<Record<TypoName, boolean>>;
type Props = TextProps & TypographyProps & { color?: ((colors: UIKitTheme['colors']) => string) | string };
const SBText: React.FC<Props> = ({ children, color, style, ...props }) => {
  const { colors } = useUIKitTheme();
  const typoStyles = useTypographyFilter(props);
  return (
    <Text
      style={[{ color: typeof color === 'string' ? color : color?.(colors) ?? colors.text }, ...typoStyles, style]}
      {...props}
    >
      {children}
    </Text>
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

  // return Object.entries({
  //   h1,
  //   h2,
  //   subtitle1,
  //   subtitle2,
  //   body1,
  //   body2,
  //   body3,
  //   button,
  //   caption1,
  //   caption2,
  //   caption3,
  //   caption4,
  // })
  //   .filter(([, val]) => val)
  //   .map(([key]) => typography[key as TypoName]);

  return useMemo(
    () =>
      Object.entries({
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
      })
        .filter(([, val]) => val)
        .map(([key]) => typography[key as TypoName]),
    [h1, h2, subtitle1, subtitle2, body1, body2, body3, button, caption1, caption2, caption3, caption4],
  );
};

export default SBText;
