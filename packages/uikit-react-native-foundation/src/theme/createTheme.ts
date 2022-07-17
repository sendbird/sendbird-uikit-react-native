import createAppearanceHelper from '../styles/createAppearanceHelper';
import createTypography, { UIKitTypographyOverrides } from '../styles/createTypography';
import type { UIKitColors, UIKitTheme } from '../types';
import Palette from './Palette';

type Options = {
  appearance: UIKitTheme['appearance'];
  colors: (palette: UIKitTheme['palette']) => UIKitColors;
  palette?: UIKitTheme['palette'];
  typography?: UIKitTypographyOverrides;
};

const createTheme = ({
  appearance,
  palette = Palette,
  colors: createColors,
  typography = { shared: { fontFamily: 'System' } },
}: Options): UIKitTheme => {
  return {
    appearance,
    select: createAppearanceHelper(appearance),
    palette,
    colors: createColors(palette),
    typography: createTypography(typography),
  };
};

export default createTheme;
