export const isStartsWithRTL = (str?: string): boolean => {
  if (!str || str.length === 0) {
    return false;
  }

  const trimmedStr = str.trimStart();
  if (trimmedStr.length === 0) {
    return false;
  }

  const firstChar = Array.from(trimmedStr)[0];
  const point = firstChar.codePointAt(0);
  if (point === undefined) {
    return false;
  }

  return isRTLCodePoint(point);
};

const isRTLCodePoint = (codePoint: number) => {
  for (const [start, end] of rtlCodePointRanges) {
    if (codePoint >= start && codePoint <= end) {
      return true;
    }
  }
  return false;
};

const rtlCodePointRanges = [
  [0x0590, 0x05ff], // Hebrew
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic Supplement
  [0x08a0, 0x08ff], // Hebrew Supplement
  [0xfb1d, 0xfb4f], // Hebrew Presentation Forms
  [0xfe70, 0xfeff], // Arabic Presentation Forms-B
  [0x1ee00, 0x1eeff], // Arabic Mathematical Alphabetic Symbols
];
