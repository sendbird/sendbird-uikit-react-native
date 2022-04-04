import type { PartialNullable } from '@sendbird/uikit-utils';

import type { FilePickerResponse, FileType } from '../platform/types';

const fileTypeGuard = ({ uri, size, name, type }: PartialNullable<FileType>): FilePickerResponse => {
  if (!uri) return null;
  return { uri, size: size ?? 0, name: name ?? '', type: type ?? '' };
};

export default fileTypeGuard;
