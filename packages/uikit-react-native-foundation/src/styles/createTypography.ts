import type { FontAttributes, UIKitTypography } from '../types';
import { DEFAULT_SCALE_FACTOR } from './createScaleFactor';

export type UIKitTypographyOverrides = Partial<UIKitTypography> & {
  shared?: Partial<FontAttributes>;
};

const createTypography = (
  overrides: UIKitTypographyOverrides = {},
  scaleFactor: (dp: number) => number = DEFAULT_SCALE_FACTOR,
): UIKitTypography => {
  return {
    h1: {
      fontWeight: '500',
      fontSize: scaleFactor(18),
      lineHeight: scaleFactor(20),
      ...overrides.h1,
      ...overrides.shared,
    },
    h2: {
      fontWeight: 'bold',
      fontSize: scaleFactor(16),
      lineHeight: scaleFactor(20),
      letterSpacing: scaleFactor(-0.2),
      ...overrides.h2,
      ...overrides.shared,
    },
    subtitle1: {
      fontWeight: '500',
      fontSize: scaleFactor(16),
      lineHeight: scaleFactor(22),
      letterSpacing: scaleFactor(-0.2),
      ...overrides.subtitle1,
      ...overrides.shared,
    },
    subtitle2: {
      fontWeight: 'normal',
      fontSize: scaleFactor(16),
      lineHeight: scaleFactor(22),
      ...overrides.subtitle2,
      ...overrides.shared,
    },
    body1: {
      fontWeight: 'normal',
      fontSize: scaleFactor(16),
      lineHeight: scaleFactor(20),
      ...overrides.body1,
      ...overrides.shared,
    },
    body2: {
      fontWeight: '500',
      fontSize: scaleFactor(14),
      lineHeight: scaleFactor(16),
      ...overrides.body2,
      ...overrides.shared,
    },
    body3: {
      fontWeight: 'normal',
      fontSize: scaleFactor(14),
      lineHeight: scaleFactor(20),
      ...overrides.body3,
      ...overrides.shared,
    },
    button: {
      fontWeight: 'bold',
      fontSize: scaleFactor(14),
      lineHeight: scaleFactor(16),
      letterSpacing: scaleFactor(0.4),
      ...overrides.button,
      ...overrides.shared,
    },
    caption1: {
      fontWeight: 'bold',
      fontSize: scaleFactor(12),
      lineHeight: scaleFactor(12),
      ...overrides.caption1,
      ...overrides.shared,
    },
    caption2: {
      fontWeight: 'normal',
      fontSize: scaleFactor(12),
      lineHeight: scaleFactor(12),
      ...overrides.caption2,
      ...overrides.shared,
    },
    caption3: {
      fontWeight: 'bold',
      fontSize: scaleFactor(11),
      lineHeight: scaleFactor(12),
      ...overrides.caption3,
      ...overrides.shared,
    },
    caption4: {
      fontWeight: 'normal',
      fontSize: scaleFactor(11),
      lineHeight: scaleFactor(12),
      ...overrides.caption4,
      ...overrides.shared,
    },
  };
};

export default createTypography;
