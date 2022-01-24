import type { FilePickerResponse, FileType } from '../platform/types';

const fileTypeGuard = ({ uri, size, name, type }: Partial<FileType>): FilePickerResponse => {
  if (!uri || !size) return null;
  return { uri, size, name: name ?? '', type: type ?? '' };
};

export default fileTypeGuard;
