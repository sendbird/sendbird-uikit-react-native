type Unsubscribe = () => void | undefined;
type DownloadedPath = string;
export type FilePickerResponse = FileType | null;
export type FileType = { uri: string; size: number; name: string; type: string };

export interface NotificationServiceInterface {
  hasPushPermission(): Promise<boolean>;
  requestPushPermission(): Promise<boolean>;

  getAPNSToken(): Promise<string | null>;
  getFCMToken(): Promise<string | null>;
  onTokenRefresh(handler: (token: string) => void): Unsubscribe;
}

export interface ClipboardServiceInterface {
  setString(text: string): void;
  getString(): Promise<string>;
}

export interface FileServiceInterface extends FilePickerServiceInterface, FileSystemServiceInterface {}
interface FilePickerServiceInterface {
  hasMediaLibraryPermission(type: 'read' | 'write' | 'all'): Promise<boolean>;
  requestMediaLibraryPermission(type: 'read' | 'write' | 'all'): Promise<boolean>;
  openMediaLibrary(options?: {
    selectionLimit?: number;
    mediaType?: 'photo' | 'video';
  }): Promise<null | FilePickerResponse[]>;

  hasCameraPermission(): Promise<boolean>;
  requestCameraPermission(): Promise<boolean>;
  openCamera(options?: { cameraType?: 'front' | 'back'; mediaType?: 'photo' | 'video' }): Promise<FilePickerResponse>;

  hasStoragePermission(): Promise<boolean>;
  requestStoragePermission(): Promise<boolean>;
  openDocument(): Promise<FilePickerResponse>;
}
interface FileSystemServiceInterface {
  save(fileUrl: string, fileName: string): Promise<DownloadedPath | null>;
}
