import Palette from '../theme/Palette';
import { TypographyOverrides, createTypography } from '../theme/Typography';
import type { UIKitColors, UIKitTheme } from '../types';
import createAppearanceHelper from './createAppearanceHelper';
import createScaleFactor from './createScaleFactor';
import createStyleSheet from './createStyleSheet';

type Options = {
  appearance: UIKitTheme['appearance'];
  palette?: UIKitTheme['palette'];
  colors: (palette: UIKitTheme['palette']) => UIKitColors;
  typography?: TypographyOverrides;
  scaleFactorOption?: {
    scaleFactor: UIKitTheme['scaleFactor'];
    applyToCreateStyleSheet: boolean;
  };
};

export const themeFactory = ({
  appearance,
  scaleFactorOption,
  palette = Palette,
  colors,
  typography = { shared: { fontFamily: 'System' } },
}: Options): UIKitTheme => {
  if (scaleFactorOption?.applyToCreateStyleSheet) createStyleSheet.updateScaleFactor(scaleFactorOption.scaleFactor);
  const scaleFactor = scaleFactorOption?.scaleFactor ?? createScaleFactor();

  return {
    appearance,
    palette,
    select: createAppearanceHelper(appearance),
    colors: colors(palette),
    typography: createTypography(typography, scaleFactor),
    scaleFactor,
  };
};
