import createExpoFileService from '../../platform/createFileService.expo';

class ExpoFile {
  static downloadFileAsync = jest.fn(async (_url: string, destination: ExpoFile, _options?: unknown) => {
    return { uri: destination.uri };
  });

  constructor(public uri: string) {}

  info() {
    return { exists: true, isDirectory: false, uri: this.uri };
  }
}

class ExpoDirectory {
  constructor(public uri: string) {}
}

const createFileService = (mediaLibraryModule: Record<string, unknown>) => {
  return createExpoFileService({
    imagePickerModule: {} as never,
    documentPickerModule: {} as never,
    mediaLibraryModule: {
      getPermissionsAsync: jest.fn(async () => ({ canAskAgain: true, granted: true, status: 'granted' })),
      requestPermissionsAsync: jest.fn(),
      ...mediaLibraryModule,
    } as never,
    fsModule: {
      File: ExpoFile,
      Directory: ExpoDirectory,
      Paths: {
        document: { uri: 'file:///documents' },
        cache: { uri: 'file:///cache' },
      },
    } as never,
  });
};

describe('createExpoFileService', () => {
  beforeEach(() => {
    ExpoFile.downloadFileAsync.mockClear();
  });

  it('uses the Expo MediaLibrary Asset API and idempotent downloads when saving media files', async () => {
    const assetCreate = jest.fn(async () => ({}));
    const saveToLibraryAsync = jest.fn(async () => {
      throw new Error('legacy media library API should not be used');
    });
    const fileService = createFileService({
      Asset: {
        create: assetCreate,
      },
      saveToLibraryAsync,
    });

    await expect(
      fileService.save({
        fileUrl: 'https://example.com/photo.jpg',
        fileName: 'photo.jpg',
        fileType: 'image/jpeg',
      }),
    ).resolves.toBe('file:///documents/photo.jpg');

    expect(ExpoFile.downloadFileAsync).toHaveBeenCalledWith(
      'https://example.com/photo.jpg',
      expect.objectContaining({ uri: 'file:///documents/photo.jpg' }),
      expect.objectContaining({ idempotent: true }),
    );
    expect(assetCreate).toHaveBeenCalledWith('file:///documents/photo.jpg');
    expect(saveToLibraryAsync).not.toHaveBeenCalled();
  });

  it('falls back to the legacy MediaLibrary save API when the Asset API is unavailable', async () => {
    const saveToLibraryAsync = jest.fn(async () => undefined);
    const fileService = createFileService({
      saveToLibraryAsync,
    });

    await expect(
      fileService.save({
        fileUrl: 'https://example.com/legacy-photo.jpg',
        fileName: 'legacy-photo.jpg',
        fileType: 'image/jpeg',
      }),
    ).resolves.toBe('file:///documents/legacy-photo.jpg');

    expect(saveToLibraryAsync).toHaveBeenCalledWith('file:///documents/legacy-photo.jpg');
  });
});
