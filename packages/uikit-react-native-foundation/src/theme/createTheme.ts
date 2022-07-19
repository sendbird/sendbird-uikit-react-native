import createSelectByColorScheme from '../styles/createSelectByColorScheme';
import createTypography, { UIKitTypographyOverrides } from '../styles/createTypography';
import type { UIKitColors, UIKitTheme } from '../types';
import Palette from './Palette';

type Options = {
  colorScheme: UIKitTheme['colorScheme'];
  colors: (palette: UIKitTheme['palette']) => UIKitColors;
  palette?: UIKitTheme['palette'];
  typography?: UIKitTypographyOverrides;
};

const createTheme = ({
  colorScheme,
  palette = Palette,
  colors: createColors,
  typography = { shared: { fontFamily: 'System' } },
}: Options): UIKitTheme => {
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
