import { defaultScaleFactor } from '../styles/scaleFactor';
import type { Typography } from '../types';

export const createTypography = (overrides: Partial<Typography> = {}, scaleFactor = defaultScaleFactor): Typography => {
  return {
    h1: {
      fontWeight: '500',
      fontSize: scaleFactor(18),
      lineHeight: scaleFactor(20),
      ...overrides.h1,
    },
    h2: {
      fontWeight: 'bold',
      fontSize: scaleFactor(16),
      lineHeight: scaleFactor(20),
      letterSpacing: scaleFactor(-0.2),
      ...overrides.h2,
    },
    subtitle1: {
      fontWeight: '500',
      fontSize: scaleFactor(16),
      lineHeight: scaleFactor(22),
      letterSpacing: scaleFactor(-0.2),
      ...overrides.subtitle1,
    },
    subtitle2: {
      fontWeight: 'normal',
      fontSize: scaleFactor(16),
      lineHeight: scaleFactor(22),
      ...overrides.subtitle2,
    },
    body1: {
      fontWeight: 'normal',
      fontSize: scaleFactor(16),
      lineHeight: scaleFactor(20),
      ...overrides.body1,
    },
    body2: {
      fontWeight: '500',
      fontSize: scaleFactor(14),
      lineHeight: scaleFactor(16),
      ...overrides.body2,
    },
    body3: {
      fontWeight: 'normal',
      fontSize: scaleFactor(14),
      lineHeight: scaleFactor(20),
      ...overrides.body3,
    },
    button: {
      fontWeight: 'normal',
      fontSize: scaleFactor(14),
      lineHeight: scaleFactor(16),
      letterSpacing: scaleFactor(0.4),
      ...overrides.button,
    },
    caption1: {
      fontWeight: 'bold',
      fontSize: scaleFactor(12),
      lineHeight: scaleFactor(12),
      ...overrides.caption1,
    },
    caption2: {
      fontWeight: 'normal',
      fontSize: scaleFactor(12),
      lineHeight: scaleFactor(12),
      ...overrides.caption2,
    },
    caption3: {
      fontWeight: 'bold',
      fontSize: scaleFactor(11),
      lineHeight: scaleFactor(12),
      ...overrides.caption3,
    },
    caption4: {
      fontWeight: 'normal',
      fontSize: scaleFactor(11),
      lineHeight: scaleFactor(12),
      ...overrides.caption4,
    },
  };
};

export const defaultTypography = createTypography();
