import createAppearanceHelper from '../styles/createAppearanceHelper';
import createTypography, { UIKitTypographyOverrides } from '../styles/createTypography';
import type { UIKitColors, UIKitTheme } from '../types';
import Palette from './Palette';

type Options<Appearance extends string> = {
  appearance: UIKitTheme<Appearance>['appearance'];
  colors: (palette: UIKitTheme<Appearance>['palette']) => UIKitColors;
  palette?: UIKitTheme<Appearance>['palette'];
  typography?: UIKitTypographyOverrides;
};

const createTheme = <Appearance extends string>({
  appearance,
  palette = Palette,
  colors: createColors,
  typography = { shared: { fontFamily: 'System' } },
}: Options<Appearance>): UIKitTheme<Appearance> => {
  return {
    appearance,
    select: createAppearanceHelper(appearance),
    palette,
    colors: createColors(palette),
    typography: createTypography(typography),
  };
};

export default createTheme;
