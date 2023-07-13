import type * as ExpoDocumentPicker from 'expo-document-picker';
import type * as ExpoFs from 'expo-file-system';
import type * as ExpoImagePicker from 'expo-image-picker';

import type { FilePickerResponse } from '../platform/types';
import normalizeFile from './normalizeFile';

const expoBackwardUtils = {
  imagePicker: {
    isCanceled(result: ExpoImagePicker.ImagePickerResult) {
      // @ts-expect-error backward compatibility
      return result.canceled ?? result.cancelled;
    },
    async toFilePickerResponses(
      result: ExpoImagePicker.ImagePickerResult,
      fsModule: typeof ExpoFs,
    ): Promise<FilePickerResponse[]> {
      if (result.assets) {
        const assets = result.assets || [];
        const promises = assets.map(({ fileName: name, fileSize: size, type, uri }) =>
          normalizeFile({ uri, size, name, type }),
        );

        return Promise.all(promises);
      } else if ('uri' in result && typeof result.uri === 'string') {
        const fileInfo = await fsModule.getInfoAsync(result.uri);
        const response = await normalizeFile({ uri: result.uri, size: expoBackwardUtils.toFileSize(fileInfo) });
        return [response];
      } else {
        return [];
      }
    },
  },
  documentPicker: {
    isCanceled(result: ExpoDocumentPicker.DocumentPickerResult) {
      // @ts-expect-error backward compatibility
      return result.canceled ?? result.type === 'cancel';
    },
    async toFilePickerResponses(result: ExpoDocumentPicker.DocumentPickerResult): Promise<FilePickerResponse[]> {
      if (result.assets) {
        const assets = result.assets || [];
        const promises = assets.map(({ name, size, mimeType, uri }) =>
          normalizeFile({ uri, size, name, type: mimeType }),
        );

        return Promise.all(promises);
      } else if ('uri' in result && typeof result.uri === 'string') {
        // @ts-expect-error backward compatibility
        const { mimeType, uri, size, name } = result;
        const response = await normalizeFile({ uri, size, name, type: mimeType });

        return [response];
      } else {
        return [];
      }
    },
  },
  toFileSize(info: ExpoFs.FileInfo) {
    if ('size' in info) {
      return info.size;
    } else {
      return 0;
    }
  },
};

export default expoBackwardUtils;
