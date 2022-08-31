export type Unsubscribe = () => void | undefined;
export type DownloadedPath = string;
export type FilePickerResponse = FileType | null;
export type FileType = { uri: string; size: number; name: string; type: string };

// ---------- NotificationService ---------- //
export interface NotificationServiceInterface {
  hasPushPermission(): Promise<boolean>;
  requestPushPermission(): Promise<boolean>;

  getAPNSToken(): Promise<string | null>;
  getFCMToken(): Promise<string | null>;
  onTokenRefresh(handler: (token: string) => void): Unsubscribe;
}

// ---------- ClipboardService ---------- //
export interface ClipboardServiceInterface {
  setString(text: string): void;
  getString(): Promise<string>;
}

// ---------- FileService ---------- //
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
  mediaType?: 'photo' | 'video' | 'all';
}
export type OpenDocumentOptions = OpenResultListener;
export interface SaveOptions {
  fileUrl: string;
  fileName: string;
  fileType?: string | null;
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

// ---------- MediaService ---------- //
interface VideoProps {
  source: { uri: string } | number;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  onLoad?: () => void;
}
interface GetVideoThumbnailOptions {
  url: string;
  timeMills?: number;
  quality?: number;
}
export interface MediaServiceInterface {
  VideoComponent<Props = {}>(props: VideoProps & Props): JSX.Element;
  getVideoThumbnail(options: GetVideoThumbnailOptions): Promise<{ path: string } | null>;
  // compressImage(options: {
  //   path: string;
  //   compressionRate: number;
  //   resizingWidth: number;
  //   resizingHeight: number;
  // }): Promise<{ path: string }>;
}
