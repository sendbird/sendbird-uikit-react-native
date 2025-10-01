import type * as ExpoAudio from 'expo-audio';
import type * as ExpoAV from 'expo-av';
import type * as ExpoDocumentPicker from 'expo-document-picker';
import type * as ExpoFs from 'expo-file-system';
import type * as ExpoImagePicker from 'expo-image-picker';
import type * as ExpoVideo from 'expo-video';

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
  expoAV: {
    isLegacyAVModule(module: ExpoAudioModule | ExpoVideoModule): module is typeof ExpoAV {
      try {
        return 'Video' in module && 'Audio' in module && typeof module.Video === 'function';
      } catch {
        return false;
      }
    },
    isAudioModule(module: ExpoAudioModule): module is typeof ExpoAudio {
      try {
        return 'useAudioRecorder' in module && typeof module.useAudioRecorder === 'function';
      } catch {
        return false;
      }
    },
    isVideoModule(module: ExpoVideoModule): module is typeof ExpoVideo {
      try {
        return 'VideoView' in module && 'useVideoPlayer' in module && typeof module.useVideoPlayer === 'function';
      } catch {
        return false;
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

export type ExpoAudioModule = typeof ExpoAV | typeof ExpoAudio;
export type ExpoVideoModule = typeof ExpoAV | typeof ExpoVideo;

export default expoBackwardUtils;
