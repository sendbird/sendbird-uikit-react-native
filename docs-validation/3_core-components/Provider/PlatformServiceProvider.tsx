import type { FileServiceInterface } from '@sendbird/uikit-react-native';
import { usePlatformService } from '@sendbird/uikit-react-native';
import type SBUError from '@sendbird/uikit-react-native/src/libs/SBUError';
import type { MediaServiceInterface } from '@sendbird/uikit-react-native/src/platform/types';

const isMediaFile = (_: string) => 0;
const documentPickerModule = {
  getDocumentAsync: async (_: object) => ({ type: '', mimeType: '', uri: '', size: 0, name: '' }),
};
const MyMediaLibraryModule = { requestPermission: async () => 0, saveToLibrary: async (_: string) => 0 };
const RNFetchBlob = { config: (_: object) => ({ fetch: async (_: string, __: string) => ({ path: () => '' }) }) };
type FileCompat = { name: string; uri: string; size: number; type: string };
type SaveRes = null | string;
type OpenMediaLibraryRes = null | Array<null | FileCompat>;
type GetFileRes = null | FileCompat;

/**
 * FileServiceInterface
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/provider/platformserviceprovider#2-fileserviceinterface}
 * */
async function _fileServiceInterface(service: FileServiceInterface) {
  const mediaType = '' as 'photo' | 'video' | 'all' | undefined;
  const onOpenFailure = (() => 0) as (error?: SBUError, originError?: unknown) => void;
  const cameraType = '' as 'front' | 'back' | undefined;
  const fileType = '' as string | null | undefined;
  const selectionLimit = 0 as number | undefined;

  const res1: SaveRes = await service.save({ fileUrl: '', fileName: '', fileType });
  const res2: OpenMediaLibraryRes = await service.openMediaLibrary({ onOpenFailure, mediaType, selectionLimit });
  const res3: GetFileRes = await service.openDocument({ onOpenFailure });
  const res4: GetFileRes = await service.openCamera({ onOpenFailure, mediaType, cameraType });
}
/** ------------------ **/

/**
 * MediaServiceInterface
 * {@link }
 * */
async function _mediaServiceInterface(service: MediaServiceInterface) {
  const jsx: JSX.Element = service.VideoComponent({
    source: 0 as number | { uri: string },
    resizeMode: '' as 'cover' | 'stretch' | 'contain' | undefined,
    onLoad: () => 0,
  });
  const res: { path: string } | null = await service.getVideoThumbnail({
    url: '' as string,
    timeMills: 0 as number | undefined,
    quality: 0 as number | undefined,
  });
}
/** ------------------ **/

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/provider/platformserviceprovider#2-usage}
 * */
// TODO: import usePlatformService
const { clipboardService } = usePlatformService();
/** ------------------ **/

/**
 * Direct implementation
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/provider/platformserviceprovider#2-direct-implementation}
 * */
// TODO: import OpenCameraOptions, OpenMediaLibraryOptions, OpenDocumentOptions, SaveOptions, FilePickerResponse
class MyFileService implements FileServiceInterface {
  async openCamera(_options?: OpenCameraOptions): Promise<FilePickerResponse> {
    // Check camera permission.
    // Request media file with camera.
    // Returns media file info.
  }

  async openMediaLibrary(_options: OpenMediaLibraryOptions): Promise<null | FilePickerResponse[]> {
    // Check media library permission.
    // Request media file from media library.
    // Returns media file info.
  }

  async openDocument(options?: OpenDocumentOptions): Promise<FilePickerResponse> {
    try {
      const response = await documentPickerModule.getDocumentAsync({
        type: '*/*',
      });
      if (response.type === 'cancel') return null;
      const { mimeType, uri, size, name } = response;
      return { uri, size, name, type: mimeType };
    } catch {
      // TODO: Provide SBUError.UNKNOWN as params
      options?.onOpenFailure?.();
      return null;
    }
  }

  async save(options: SaveOptions): Promise<string> {
    // As an example, use `rn-fetch-blob` instead of `react-native-file-access`.
    const response = await RNFetchBlob.config({ fileCache: true }).fetch('GET', options.fileUrl);

    if (isMediaFile(response.path())) {
      const granted = await MyMediaLibraryModule.requestPermission();
      if (granted) await MyMediaLibraryModule.saveToLibrary(response.path());
    }

    return response.path();
  }
}
/** ------------------ **/
