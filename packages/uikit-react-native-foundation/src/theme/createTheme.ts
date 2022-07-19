import createSelectByColorScheme from '../styles/createSelectByColorScheme';
import createTypography, { UIKitTypographyOverrides } from '../styles/createTypography';
import type { UIKitColors, UIKitTheme } from '../types';
import Palette from './Palette';

type Options<T extends string> = {
  colorScheme: UIKitTheme<T>['colorScheme'];
  colors: (palette: UIKitTheme<T>['palette']) => UIKitColors;
  palette?: UIKitTheme<T>['palette'];
  typography?: UIKitTypographyOverrides;
};

const createTheme = <T extends string>({
  colorScheme,
  palette = Palette,
  colors: createColors,
  typography = { shared: { fontFamily: 'System' } },
}: Options<T>): UIKitTheme<T> => {
  let _palette = palette;
  let _colors = createColors(_palette);

  return {
    colorScheme,
    select: createSelectByColorScheme(colorScheme),
    get palette() {
      return _palette;
    },
    set palette(value) {
      _palette = value;
      _colors = createColors(_palette);
    },
    get colors() {
      return _colors;
    },
    set colors(value) {
      _colors = value;
    },
    typography: createTypography(typography),
  };
};

export default createTheme;
