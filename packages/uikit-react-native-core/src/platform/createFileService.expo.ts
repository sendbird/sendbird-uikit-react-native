import type ExpoDocumentPicker from 'expo-document-picker';
import type ExpoFs from 'expo-file-system';
import type ExpoImagePicker from 'expo-image-picker';
import type ExpoMediaLibrary from 'expo-media-library';

import { getFileExtension, getFileType } from '@sendbird/uikit-utils';

import type { ExpoMediaLibraryPermissionResponse, ExpoPermissionResponse } from '../utils/expoPermissionGranted';
import expoPermissionGranted from '../utils/expoPermissionGranted';
import fileTypeGuard from '../utils/fileTypeGuard';
import type { FilePickerResponse, FileServiceInterface } from './types';

const createExpoFileService = ({
  imagePickerModule,
  documentPickerModule,
  mediaLibraryModule,
  fsModule,
}: {
  imagePickerModule: typeof ExpoImagePicker;
  documentPickerModule: typeof ExpoDocumentPicker;
  mediaLibraryModule: typeof ExpoMediaLibrary;
  fsModule: typeof ExpoFs;
}): FileServiceInterface => {
  return {
    async hasCameraPermission(): Promise<boolean> {
      const res = (await imagePickerModule.getCameraPermissionsAsync()) as ExpoPermissionResponse;
      return expoPermissionGranted([res]);
    },
    async requestCameraPermission(): Promise<boolean> {
      const res = (await imagePickerModule.requestCameraPermissionsAsync()) as ExpoPermissionResponse;
      return expoPermissionGranted([res]);
    },
    async openCamera(options): Promise<FilePickerResponse> {
      const hasPermission = await this.hasCameraPermission();
      if (!hasPermission) {
        const granted = await this.requestCameraPermission();
        if (!granted) return null;
      }

      const response = await imagePickerModule.launchCameraAsync({
        mediaTypes:
          options?.mediaType === 'photo'
            ? imagePickerModule.MediaTypeOptions.Images
            : imagePickerModule.MediaTypeOptions.Videos,
      });

      if (response.cancelled) return null;

      const { uri } = response;
      const { size } = await fsModule.getInfoAsync(response.uri);
      const ext = getFileExtension(uri);
      const type = getFileType(uri);

      return fileTypeGuard({ uri, size, type: `${type}/${ext.slice(1)}`, name: Date.now() + ext });
    },

    async hasMediaLibraryPermission(type): Promise<boolean> {
      const perms = (await mediaLibraryModule.getPermissionsAsync(
        type === 'write',
      )) as ExpoMediaLibraryPermissionResponse;
      return expoPermissionGranted([perms], () => mediaLibraryModule.presentPermissionsPickerAsync());
    },
    async requestMediaLibraryPermission(type): Promise<boolean> {
      const perms = (await mediaLibraryModule.requestPermissionsAsync(
        type === 'write',
      )) as ExpoMediaLibraryPermissionResponse;
      return expoPermissionGranted([perms]);
    },

    async openMediaLibrary(options) {
      const selectionLimit = options?.selectionLimit || 1;
      const hasPermission = await this.hasMediaLibraryPermission('read');
      if (!hasPermission) {
        const granted = await this.requestMediaLibraryPermission('read');
        if (!granted) return null;
      }

      const response = await imagePickerModule.launchImageLibraryAsync({ allowsMultipleSelection: true });
      if (response.cancelled) return null;

      return Promise.all(
        response.selected.slice(0, selectionLimit).map(async ({ uri }) => {
          const { size } = await fsModule.getInfoAsync(uri);
          const ext = getFileExtension(uri);
          const type = getFileType(uri);
          return fileTypeGuard({ uri, size, type: `${type}/${ext.slice(1)}`, name: Date.now() + ext });
        }),
      );
    },

    async hasStoragePermission(): Promise<boolean> {
      return true;
    },
    async requestStoragePermission(): Promise<boolean> {
      return true;
    },
    async openDocument(): Promise<FilePickerResponse> {
      const response = await documentPickerModule.getDocumentAsync({ type: '*/*' });
      if (response.type === 'cancel') return null;
      const { mimeType, uri, size, name } = response;
      return fileTypeGuard({ uri, size, name, type: mimeType });
    },

    async save(fileUrl: string, fileName: string): Promise<string> {
      const hasPermission = await this.hasMediaLibraryPermission('write');
      if (!hasPermission) {
        const granted = await this.requestMediaLibraryPermission('write');
        if (!granted) throw new Error('Permission not granted');
      }

      const basePath = fsModule.documentDirectory || fsModule.cacheDirectory;
      if (!basePath) throw new Error('Cannot determine directory');

      const downloadPath = `${basePath}/${fileName}`;

      const response = await fsModule.downloadAsync(fileUrl, downloadPath);
      await mediaLibraryModule.saveToLibraryAsync(response.uri);
      return response.uri;
    },
  };
};

export default createExpoFileService;
