import type { UIKitPalette } from '@sendbird/uikit-react-native-foundation';

export const getContrastColor = (
  color:
    | 'transparent'
    | `#${string}`
    | `rgba(${number},${number},${number},${number})`
    | `rgb(${number},${number},${number})`,
) => {
  if (color.startsWith('rgb')) {
    const [r, g, b, a] = color
      .replace(/rgba?|\(|\)/g, '')
      .split(',')
      .map((c) => Number(c ?? 0));
    if (a < 0.2) return 'gray';
    return (r * 299 + g * 587 + b * 114) / 1000 > 125 ? 'black' : 'white';
  }

  if (color.startsWith('#')) {
    const [r1, r2, g1, g2, b1, b2] = color.replace('#', '');
    const convHex = (hex1: string, hex2: string) => parseInt(hex1 + hex2, 16);
    return (convHex(r1, r2) * 299 + convHex(g1, g2) * 587 + convHex(b1, b2) * 114) / 1000 > 125 ? 'black' : 'white';
  }

  if (color === 'transparent') return 'gray';
  throw new Error('invalid color format:' + color);
};

export const findColorNameFromPalette = (palette: UIKitPalette, targetHex: string) => {
  const map = Object.entries(palette);
  const color = map.find(([, hex]) => hex === targetHex);
  if (!color) return 'NOT_FOUND';
  return color[0];
};
