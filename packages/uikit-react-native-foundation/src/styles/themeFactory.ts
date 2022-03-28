import Palette from '../theme/Palette';
import { createTypography } from '../theme/Typography';
import type { UIKitColors, UIKitTheme } from '../types';
import createAppearanceHelper from './createAppearanceHelper';
import createScaleFactor from './createScaleFactor';
import createStyleSheet from './createStyleSheet';

type Options = {
  appearance: UIKitTheme['appearance'];
  palette?: UIKitTheme['palette'];
  colors: (palette: UIKitTheme['palette']) => UIKitColors;
  scaleFactorOption?: {
    scaleFactor: UIKitTheme['scaleFactor'];
    applyToCreateStyleSheet: boolean;
  };
};

const defaultScaleFactor = createScaleFactor();

export const themeFactory = ({ appearance, scaleFactorOption, palette = Palette, colors }: Options): UIKitTheme => {
  if (scaleFactorOption?.applyToCreateStyleSheet) createStyleSheet.updateScaleFactor(scaleFactorOption.scaleFactor);
  const _scaleFactor = scaleFactorOption?.scaleFactor ?? defaultScaleFactor;

  return {
    appearance,
    palette,
    select: createAppearanceHelper(appearance),
    colors: colors(palette),
    scaleFactor: _scaleFactor,
    typography: createTypography({ shared: { fontFamily: 'System' } }, _scaleFactor),
  };
};
