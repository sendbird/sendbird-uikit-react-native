import type * as ExpoAudio from 'expo-audio';
import type * as ExpoAV from 'expo-av';
import type * as ExpoDocumentPicker from 'expo-document-picker';
import type * as ExpoFs from 'expo-file-system';
import type * as ExpoImagePicker from 'expo-image-picker';
import type * as ExpoVideo from 'expo-video';

import type { FilePickerResponse } from '../platform/types';
import normalizeFile from './normalizeFile';

// Legacy expo-file-system API types (before SDK 54)
interface ExpoFileSystemLegacy {
  documentDirectory: string | null;
  cacheDirectory: string | null;
  getInfoAsync(fileUri: string, options?: unknown): Promise<ExpoFs.FileInfo>;
  downloadAsync(uri: string, fileUri: string, options?: unknown): Promise<{ uri: string }>;
}

// New expo-file-system API types (SDK 54+)
interface ExpoDirectory {
  uri: string;
}

interface ExpoFileSystemNew {
  File: {
    new (...uris: (string | unknown)[]): {
      info(options?: unknown): ExpoFs.FileInfo;
    };
    downloadFileAsync(url: string, destination: unknown, options?: unknown): Promise<{ uri: string }>;
  };
  Directory: new (...uris: (string | unknown)[]) => ExpoDirectory;
  Paths: {
    document: ExpoDirectory;
    cache: ExpoDirectory;
  };
}

// Union type for both legacy and new expo-file-system
type ExpoFileSystemModule = ExpoFileSystemLegacy | ExpoFileSystemNew | typeof ExpoFs;

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
    if ('size' in info && info.size !== undefined) {
      return info.size;
    } else {
      return 0;
    }
  },
  fileSystem: {
    isLegacyModule(fsModule: ExpoFileSystemModule): fsModule is ExpoFileSystemLegacy {
      try {
        return 'documentDirectory' in fsModule || 'cacheDirectory' in fsModule;
      } catch {
        return false;
      }
    },
    async getFileInfo(fsModule: ExpoFileSystemModule, uri: string): Promise<ExpoFs.FileInfo> {
      if (expoBackwardUtils.fileSystem.isLegacyModule(fsModule)) {
        return await fsModule.getInfoAsync(uri);
      } else {
        const file = new fsModule.File(uri);
        return file.info();
      }
    },
    getDocumentDirectory(fsModule: ExpoFileSystemModule): string | null {
      if (expoBackwardUtils.fileSystem.isLegacyModule(fsModule)) {
        return fsModule.documentDirectory || null;
      } else {
        return fsModule.Paths?.document?.uri || null;
      }
    },
    getCacheDirectory(fsModule: ExpoFileSystemModule): string | null {
      if (expoBackwardUtils.fileSystem.isLegacyModule(fsModule)) {
        return fsModule.cacheDirectory || null;
      } else {
        return fsModule.Paths?.cache?.uri || null;
      }
    },
    async downloadFile(fsModule: ExpoFileSystemModule, url: string, localUri: string): Promise<{ uri: string }> {
      if (expoBackwardUtils.fileSystem.isLegacyModule(fsModule)) {
        return await fsModule.downloadAsync(url, localUri);
      } else {
        const destination = new fsModule.File(localUri);
        const result = await fsModule.File.downloadFileAsync(url, destination as never);
        return { uri: result.uri };
      }
    },
  },
};

export type ExpoAudioModule = typeof ExpoAV | typeof ExpoAudio;
export type ExpoVideoModule = typeof ExpoAV | typeof ExpoVideo;

export default expoBackwardUtils;
