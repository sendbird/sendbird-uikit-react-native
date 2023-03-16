const MIME_EXTENSION_MAP = {
  // Image
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',

  // Video
  'video/3gpp': '3gp',
  'video/mp4': 'mp4',
  'video/mpeg': 'mpeg',
  'video/ogg': 'ogv',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/x-msvideo': 'avi',

  // Audio
  'audio/aac': 'aac',
  'audio/midi': 'mid',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/webm': 'weba',

  // Files
  'text/plain': 'txt',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/zip': 'zip',
  'application/x-gzip': 'gzip',
} as Record<string, string>;

export const imageExtRegex = /jpeg|jpg|png|webp|gif/i;
export const audioExtRegex = /3gp|aac|aax|act|aiff|flac|gsm|m4a|m4b|m4p|tta|wma|mp3|webm|wav/i;
export const videoExtRegex = /mov|vod|mp4|avi/i;
export const getFileType = (extOrType: string) => {
  if (extOrType.indexOf('/') > -1) {
    const type = extOrType.split('/')[0];
    if (type === 'video') return 'video';
    if (type === 'audio') return 'audio';
    if (type === 'image') return 'image';
    return 'file';
  }

  if (extOrType.match(imageExtRegex)) return 'image';
  if (extOrType.match(audioExtRegex)) return 'audio';
  if (extOrType.match(videoExtRegex)) return 'video';
  return 'file';
};

/**
 * Calculates the downscaled size of an image while preserving its aspect ratio.
 *
 * @param {Object} origin - The original size object with `width` and `height` properties.
 * @param {Object} resizing - The resizing object with optional `width` and `height` properties.
 * @returns {Object} - A new size object with the downscaled `width` and `height` properties.
 * @example
 * ```ts
 *   getDownscaleSize({ width: 1200, height: 800 }, { width: 600 }); // returns { width: 600, height: 400 }
 * ```
 */
type Size = { width: number; height: number };
export function getDownscaleSize(origin: Size, resizing: Partial<Size>) {
  let ratio: number;

  const maxWidth = resizing.width || origin.width,
    maxHeight = resizing.height || origin.height;

  if (origin.width <= maxWidth && origin.height <= maxHeight) {
    ratio = 1;
  } else if (origin.width > maxWidth && origin.height <= maxHeight) {
    ratio = maxWidth / origin.width;
  } else if (origin.width <= maxWidth && origin.height > maxHeight) {
    ratio = maxHeight / origin.height;
  } else {
    ratio = Math.min(maxWidth / origin.width, maxHeight / origin.height);
  }

  return { width: origin.width * ratio, height: origin.height * ratio };
}

/**
 * Normalize a file name by ensuring it has the given extension, if it doesn't already.
 *
 * @param {string} fileName - The file name to normalize.
 * @param {string} extension - The desired extension, without a leading period.
 * @returns {string} - The normalized file name, with the extension.
 */
export function normalizeFileName(fileName: string, extension: string) {
  if (!extension) return fileName;

  // .extension
  let _extension = extension.toLowerCase();
  if (_extension.indexOf('.') !== 0) {
    _extension = '.' + _extension;
  }

  // filename.extension | filename
  const _filename = fileName.toLowerCase();
  const hasExtension = _filename.lastIndexOf(_extension) === _filename.length - _extension.length;
  if (!hasExtension) {
    // filename.extension
    return fileName + _extension;
  } else {
    // filename.extension
    return fileName;
  }
}

/**
 * Parses a MIME type string into its components.
 *
 * @param mimeType - The MIME type string to parse.
 * @returns An object containing the type, subtype, and parameters of the MIME type.
 */
type MimeType = { type: string; subtype: string; parameters: Record<string, string> };
export function parseMimeType(mimeType: string): MimeType {
  const [fullType, ...parts] = mimeType.split(';');
  const [type, subtype] = fullType.split('/');
  const parameters: MimeType['parameters'] = {};

  for (const part of parts) {
    const [name, value] = part.trim().split('=');
    parameters[name] = value;
  }

  return { type, subtype, parameters };
}

/**
 * Returns the file extension based on the MIME type.
 *
 * @param {string | null | undefined} mimeType - The MIME type to look up.
 * @returns {string} - The file extension for the given MIME type, or an empty string if no matching file extension was found.
 */
export function getFileExtensionFromMime(mimeType?: string | null): string {
  if (!mimeType) return '';
  return MIME_EXTENSION_MAP[mimeType] || '';
}

/**
 * Returns the MIME type based on the file extension.
 *
 * @param {string | null | undefined} ext - The file extension to look up.
 * @returns {string} - The MIME type for the given file extension, or an empty string if no matching MIME type was found.
 */
export function getMimeFromFileExtension(ext?: string | null) {
  if (!ext) return '';
  const EXTENSION_MIME_MAP = Object.entries(MIME_EXTENSION_MAP).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);
  return EXTENSION_MIME_MAP[ext.toLowerCase()] || '';
}

/**
 * Returns the file extension of a file path.
 *
 * @param {string} filePath - The file path to extract the extension from.
 * @returns {string} - The file extension, or an empty string if the file path does not have an extension.
 */
export function getFileExtension(filePath: string) {
  const idx = filePath.lastIndexOf('.');
  if (idx === -1) return '';
  const result = filePath.slice(idx - filePath.length).toLowerCase();
  if (result === '.') return '';
  else return result;
}

export function isImage(filePath: string, mimeType?: string) {
  const type = getFileType(mimeType || getFileExtension(filePath));
  return type === 'image';
}

export function shouldCompressImage(filePath: string, compressionEnabled = true) {
  const extension = getFileExtension(filePath);
  return Boolean(extension.match(/jpg|jpeg|png/i) && compressionEnabled);
}
