export interface NotificationServiceInterface {
  hasPushPermission(): Promise<boolean>;
  requestPushPermission(): Promise<boolean>;

  getAPNSToken(): Promise<string | null>;
  getFCMToken(): Promise<string | null>;
  onTokenRefresh(handler: (token: string) => void): () => void | undefined;
}

export interface FilePickerServiceInterface {
  hasMediaLibraryPermission(): Promise<boolean>;
  requestMediaLibraryPermission(): Promise<boolean>;
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
export type FilePickerResponse = FileType | null;
export type FileType = { uri: string; size: number; name: string; type: string };

export interface ClipboardServiceInterface {
  setString(text: string): void;
  getString(): Promise<void>;
}

export interface FileSystemServiceInterface {
  download(fileUrl: string, downloadPath: string): Promise<void>;
}
