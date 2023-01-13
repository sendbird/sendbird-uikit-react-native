import { getFileExtension, getFileType } from './regex';

/**
 * Converts a given string to a hashed string.
 * */
export function hash(str: string) {
  return String(Math.abs(str.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)));
}

/**
 * Replace a specific range of text in the string with another text.
 * */
export function replace(str: string, start: number, end: number, text: string) {
  return str.slice(0, start) + text + str.slice(end);
}

/**
 * Returns the value corresponding to the first true index of a given condition array.
 * */
export function conditionChaining<T, V>(conditions: T[], values: V[]) {
  const idx = conditions.findIndex((state) => Boolean(state));
  return idx > -1 ? values[idx] : values[values.length - 1];
}

/**
 * Calculates the downscale size.
 * */
type Size = { width: number; height: number };
export function getDownscaleSize(origin: Size, resizing: Partial<Size>) {
  let ratio;

  const maxWidth = resizing.width || origin.width,
    maxHeight = resizing.height || origin.height;

  if (origin.width <= maxWidth && origin.height <= maxHeight) {
    ratio = 1;
  } else if (origin.width > maxWidth && origin.height <= maxHeight) {
    ratio = maxWidth / origin.width;
  } else if (origin.width <= maxWidth && origin.height > maxHeight) {
    ratio = maxHeight / origin.height;
  } else {
    ratio = Math.max(maxWidth / origin.width, maxHeight / origin.height);
  }

  return { width: origin.width * ratio, height: origin.height * ratio };
}

export function isImage(filePath: string, mimeType?: string) {
  const type = getFileType(mimeType || getFileExtension(filePath));
  return type === 'image';
}

export function shouldCompressImage(filePath: string, compressionEnabled = true) {
  const extension = getFileExtension(filePath);
  return Boolean(extension.match(/jpg|jpeg|png/i) && compressionEnabled);
}
