import type { PartialNullable } from '@sendbird/uikit-utils';
import {
  getFileExtension,
  getFileExtensionFromMime,
  getMimeFromFileExtension,
  normalizeFileName,
} from '@sendbird/uikit-utils';

import type { FilePickerResponse, FileType } from '../platform/types';

const normalizeFile = ({ uri, size, name, type }: PartialNullable<FileType>): FilePickerResponse => {
  // URI is required property
  if (!uri) return null;

  let filename = name || String(Date.now());
  let filetype = type || '';

  const extension = getFileExtension(uri) || getFileExtension(filename) || getFileExtensionFromMime(filetype);
  if (extension) {
    filename = normalizeFileName(filename, extension);
    filetype = getMimeFromFileExtension(extension);
  }

  return { uri, name: filename, type: filetype, size: size ?? 0 };
};

export default normalizeFile;
