const EXTENSION_MIME_MAP = {
  // Image
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',

  // Video
  '3gp': 'video/3gpp',
  'mp4': 'video/mp4',
  'mpeg': 'video/mpeg',
  'ogv': 'video/ogg',
  'video/quicktime': 'mov',
  'webm': 'video/webm',
  'avi': 'video/x-msvideo',

  // Audio
  'aac': 'audio/aac',
  'm4a': 'audio/m4a',
  'mid': 'audio/midi',
  'mp3': 'audio/mpeg',
  'ogg': 'audio/ogg',
  'wav': 'audio/wav',
  'weba': 'audio/webm',

  // Files
  'txt': 'text/plain',
  'pdf': 'application/pdf',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'ppt': 'application/vnd.ms-powerpoint',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'zip': 'application/zip',
  'json': 'application/json',
  'gzip': 'application/x-gzip',
} as Record<string, string>;

export const imageExtRegex = /jpeg|jpg|png|webp|gif/i;
export const audioExtRegex = /3gp|aac|aax|act|aiff|flac|gsm|m4a|m4b|m4p|tta|wma|mp3|webm|wav|ogg/i;
export const videoExtRegex = /mov|vod|mp4|avi|mpeg|ogv/i;
export const getFileType = (extensionOrType: string) => {
  const lowerCased = extensionOrType.toLowerCase();

  // mime type
  if (lowerCased.indexOf('/') > -1) {
    const type = lowerCased.split('/')[0];
    if (type === 'video') return 'video';
    if (type === 'audio') return 'audio';
    if (type === 'image') return 'image';
    return 'file';
  }

  // extensions
  if (lowerCased.match(imageExtRegex)) return 'image';
  if (lowerCased.match(audioExtRegex)) return 'audio';
  if (lowerCased.match(videoExtRegex)) return 'video';

  // others
  if (lowerCased.startsWith('image')) return 'image';
  if (lowerCased.startsWith('audio')) return 'audio';
  if (lowerCased.startsWith('video')) return 'video';

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
  const MIME_EXTENSION_MAP = Object.entries(EXTENSION_MIME_MAP).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);

  const extension = MIME_EXTENSION_MAP[mimeType.toLowerCase()];
  if (extension) return '.' + extension;
  return '';
}

/**
 * Returns the MIME type based on the file extension.
 *
 * @param {string | null | undefined} ext - The file extension to look up.
 * @returns {string} - The MIME type for the given file extension, or an empty string if no matching MIME type was found.
 */
export function getMimeFromFileExtension(ext?: string | null) {
  if (!ext) return '';

  const sliceIdx = ext.lastIndexOf('.');
  const extWithoutDot = sliceIdx === -1 ? ext : ext.slice(sliceIdx + 1);

  return EXTENSION_MIME_MAP[extWithoutDot.toLowerCase()] || '';
}

/**
 * Returns the file extension of a file path.
 *
 * @param {string} filePath - The file path to extract the extension from.
 * @returns {string} - The file extension, or an empty string if the file path does not have an extension.
 */
export function getFileExtension(filePath: string) {
  const pathWithoutParams = filePath.split('?')[0];

  const idx = pathWithoutParams.lastIndexOf('.');
  if (idx === -1) return '';

  const result = pathWithoutParams.slice(idx - pathWithoutParams.length).toLowerCase();
  if (result === '.') return '';
  else return result;
}

export async function getFileExtensionFromUri(uri: string) {
  const type = await fetch(uri).then((response) => response.headers.get('content-type'));
  return getFileExtensionFromMime(type);
}

export function isImage(filePath: string, mimeType?: string) {
  const type = getFileType(mimeType || getFileExtension(filePath));
  return type === 'image';
}

export function shouldCompressImage(mime: string, compressionEnabled = true) {
  const extension = isJPG(mime) ? 'jpg' : getFileExtensionFromMime(mime);
  return Boolean(extension.match(/jpg|jpeg|png/i) && compressionEnabled);
}

/**
 * https://github.com/gathertown/sendbird-uikit-react-native/pull/29
 * This function is used solely for the purpose of classifying `image/jpg`.
 *
 * We only use it to determine whether image compression is applied because `image/jpg` is not a MIME type standard.
 * Therefore, it is not reflected in `EXTENSION_MIME_MAP`, which extracts MIME types uploaded to the server. (to comply standard)
 * */
function isJPG(mime: string) {
  return mime === 'image/jpg';
}
