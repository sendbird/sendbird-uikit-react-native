import type { ReactNode } from 'react';

import type SBUError from '../libs/SBUError';

export type Unsubscribe = () => void | undefined;
export type DownloadedPath = string;
export type FilePickerResponse = FileType | null;

/**
 * We are following the file format of react-native FormData
 * @see https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Network/FormData.js#L37-L41
 * */
export type FileType = { name: string; uri: string; size: number; type: string };

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
  onOpenFailure?: (error: SBUError, originError?: unknown) => void;
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
  createRecordFilePath(customExtension?: string): { recordFilePath: string; uri: string };
}

// ---------- MediaService ---------- //
export type VideoProps = {
  source: { uri: string } | number;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  onLoad?: () => void;
};

export type GetVideoThumbnailOptions = {
  url: string;
  timeMills?: number;
  quality?: number;
};
export type GetVideoThumbnailResult = Promise<{ path: string } | null>;

export type CompressImageOptions = {
  /**
   * A uri of image file to compress
   * */
  uri: string;

  /**
   * A resize width, apply only to downscale
   * */
  maxWidth?: number;

  /**
   * A resize height, apply only to downscale
   * */
  maxHeight?: number;

  /**
   * A value in range 0.0 - 1.0 specifying compression level of the result image.
   * 1 means highest quality and 0 the lowest quality.
   * */
  compressionRate?: number;
};
export type CompressImageResult = Promise<{ uri: string; size: number } | null>;

export interface MediaServiceInterface {
  VideoComponent<Props = {}>(props: VideoProps & Props): ReactNode;
  getVideoThumbnail(options: GetVideoThumbnailOptions): GetVideoThumbnailResult;
  compressImage(options: CompressImageOptions): CompressImageResult;
}

// ---------- PlayerService ---------- //
export interface PlayerServiceInterface {
  uri?: string;
  state: 'idle' | 'preparing' | 'playing' | 'paused' | 'stopped';

  /**
   * Check and request permission for the player.
   * */
  requestPermission(): Promise<boolean>;

  /**
   * Add a playback listener.
   * */
  addPlaybackListener(
    callback: (params: { currentTime: number; duration: number; stopped: boolean }) => void,
  ): Unsubscribe;

  /**
   * Add a state listener.
   * */
  addStateListener(callback: (state: PlayerServiceInterface['state']) => void): Unsubscribe;

  /**
   * State transition:
   *   [idle, stopped] to [playing] - start from the beginning
   *   [paused] to [playing] - resume
   * */
  play(uri: string): Promise<void>;

  /**
   * State transition:
   *   [playing] to [paused]
   * */
  pause(): Promise<void>;

  /**
   * State transition:
   *   [preparing, playing, paused] to [stop]
   * */
  stop(): Promise<void>;

  /**
   * State transition:
   *   [*] to [idle]
   * */
  reset(): Promise<void>;

  /**
   * Seek time, only available when the state is [playing, paused].
   * */
  seek(time: number): Promise<void>;
}

// ---------- RecorderService ---------- //
export interface RecorderOptions {
  /**
   * Minimum recording duration (milliseconds).
   * */
  minDuration: number;

  /**
   * Maximum recording duration (milliseconds).
   * */
  maxDuration: number;

  /**
   * File extension for recorded audio file
   * */
  extension: string;
}

export interface RecorderServiceInterface {
  uri?: string;
  options: RecorderOptions;
  state: 'idle' | 'preparing' | 'recording' | 'completed';

  /**
   * Check and request permission for the recorder.
   * */
  requestPermission(): Promise<boolean>;

  /**
   * Add recording listener.
   * */
  addRecordingListener(callback: (params: { currentTime: number; completed: boolean }) => void): Unsubscribe;

  /**
   * Add state listener.
   * */
  addStateListener(callback: (state: RecorderServiceInterface['state']) => void): Unsubscribe;

  /**
   * State transition:
   *   [idle, completed] to [recording]
   * */
  record(uri?: string): Promise<void>;

  /**
   * State transition:
   *   [recording] to [completed]
   * */
  stop(): Promise<void>;

  /**
   * State transition:
   *   [*] to [idle]
   * */
  reset(): Promise<void>;
}
