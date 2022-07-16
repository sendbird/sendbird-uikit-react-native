import createAppearanceHelper from '../styles/createAppearanceHelper';
import createScaleFactor from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import createTypography, { UIKitTypographyOverrides } from '../styles/createTypography';
import type { UIKitColors, UIKitTheme } from '../types';
import Palette from './Palette';

type Options = {
  appearance: UIKitTheme['appearance'];
  colors: (palette: UIKitTheme['palette']) => UIKitColors;
  palette?: UIKitTheme['palette'];
  typography?: UIKitTypographyOverrides;
  scaleFactorOption?: {
    scaleFactor: UIKitTheme['scaleFactor'];
    applyToCreateStyleSheet: boolean;
  };
};

const createTheme = ({
  appearance,
  palette = Palette,
  colors: createColors,
  typography = { shared: { fontFamily: 'System' } },
  scaleFactorOption,
}: Options): UIKitTheme => {
  if (scaleFactorOption?.applyToCreateStyleSheet) createStyleSheet.updateScaleFactor(scaleFactorOption.scaleFactor);
  const scaleFactor = scaleFactorOption?.scaleFactor ?? createScaleFactor();

  return {
    appearance,
    select: createAppearanceHelper(appearance),
    palette,
    colors: createColors(palette),
    scaleFactor,
    typography: createTypography(typography, scaleFactor),
  };
};

export default createTheme;
