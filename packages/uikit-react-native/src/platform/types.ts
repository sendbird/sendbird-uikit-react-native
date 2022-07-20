export type Unsubscribe = () => void | undefined;
export type DownloadedPath = string;
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

export interface OpenResultListener {
  onOpenFailureWithToastMessage?: () => void;
}
export interface OpenMediaLibraryOptions extends OpenResultListener {
  selectionLimit?: number;
  mediaType?: 'photo' | 'video' | 'all';
}
export interface OpenCameraOptions extends OpenResultListener {
  cameraType?: 'front' | 'back';
  mediaType?: 'photo' | 'video';
}
export type OpenDocumentOptions = OpenResultListener;
export interface SaveOptions {
  fileUrl: string;
  fileName: string;
}

export interface FilePickerServiceInterface {
  openMediaLibrary(options?: OpenMediaLibraryOptions): Promise<null | FilePickerResponse[]>;
  openCamera(options?: OpenCameraOptions): Promise<FilePickerResponse>;
  openDocument(options?: OpenDocumentOptions): Promise<FilePickerResponse>;
}

export interface FileSystemServiceInterface {
  // NOTE: On iOS, You can access the downloaded files by providing options below to info.plist
  // - Supports opening documents in place
  // - Application supports iTunes file sharing
  save(options?: SaveOptions): Promise<DownloadedPath | null>;
}
