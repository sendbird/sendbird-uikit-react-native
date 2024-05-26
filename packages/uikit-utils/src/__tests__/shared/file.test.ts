import {
  getDownscaleSize,
  getFileExtension,
  getFileExtensionFromMime,
  getFileExtensionFromUri,
  getFileType,
  getMimeFromFileExtension,
  normalizeFileName,
  parseMimeType,
  shouldCompressImage,
} from '../../shared/file';

describe('getFileType', function () {
  it('should return the proper file type with mime-type', () => {
    expect(getFileType('image/jpeg')).toBe('image');
    expect(getFileType('image/png')).toBe('image');
    expect(getFileType('image/gif')).toBe('image');
    expect(getFileType('video/mp4')).toBe('video');
    expect(getFileType('video/quicktime')).toBe('video');
    expect(getFileType('audio/mpeg')).toBe('audio');
    expect(getFileType('audio/mp3')).toBe('audio');
    expect(getFileType('audio/ogg')).toBe('audio');
    expect(getFileType('application/pdf')).toBe('file');
    expect(getFileType('application/json')).toBe('file');
    expect(getFileType('application/zip')).toBe('file');
    expect(getFileType('application/x-gzip')).toBe('file');
    expect(getFileType('text/plain')).toBe('file');
  });

  it('should return the proper file type with file extension', () => {
    expect(getFileType('.jpeg')).toBe('image');
    expect(getFileType('jpeg')).toBe('image');
    expect(getFileType('.jpg')).toBe('image');
    expect(getFileType('jpg')).toBe('image');
    expect(getFileType('.png')).toBe('image');
    expect(getFileType('png')).toBe('image');
    expect(getFileType('.gif')).toBe('image');
    expect(getFileType('gif')).toBe('image');
    expect(getFileType('.mp4')).toBe('video');
    expect(getFileType('mp4')).toBe('video');
    expect(getFileType('.mov')).toBe('video');
    expect(getFileType('mov')).toBe('video');
    expect(getFileType('.mpeg')).toBe('video');
    expect(getFileType('mpeg')).toBe('video');
    expect(getFileType('.mp3')).toBe('audio');
    expect(getFileType('mp3')).toBe('audio');
    expect(getFileType('.ogg')).toBe('audio');
    expect(getFileType('ogg')).toBe('audio');
    expect(getFileType('.wav')).toBe('audio');
    expect(getFileType('wav')).toBe('audio');
    expect(getFileType('.pdf')).toBe('file');
    expect(getFileType('pdf')).toBe('file');
    expect(getFileType('.json')).toBe('file');
    expect(getFileType('json')).toBe('file');
    expect(getFileType('.zip')).toBe('file');
    expect(getFileType('zip')).toBe('file');
    expect(getFileType('.gzip')).toBe('file');
    expect(getFileType('gzip')).toBe('file');
    expect(getFileType('.txt')).toBe('file');
    expect(getFileType('txt')).toBe('file');
  });

  it('should return the proper file type with type', () => {
    expect(getFileType('image')).toBe('image');
    expect(getFileType('video')).toBe('video');
    expect(getFileType('audio')).toBe('audio');
    expect(getFileType('invalid-value')).toBe('file');
  });
});

describe('getDownscaleSize', () => {
  it('should return the original size when no resizing is necessary', () => {
    const origin = { width: 500, height: 400 };
    const resizing = {};
    const expected = { width: 500, height: 400 };
    const result = getDownscaleSize(origin, resizing);
    expect(result).toEqual(expected);
  });

  it('should return the downscaled size with the same aspect ratio when only width is specified', () => {
    const origin = { width: 1200, height: 800 };
    const resizing = { width: 600 };
    const expected = { width: 600, height: 400 };
    const result = getDownscaleSize(origin, resizing);
    expect(result).toEqual(expected);
  });

  it('should return the downscaled size with the same aspect ratio when only height is specified', () => {
    const origin = { width: 1200, height: 800 };
    const resizing = { height: 300 };
    const expected = { width: 450, height: 300 };
    const result = getDownscaleSize(origin, resizing);
    expect(result).toEqual(expected);
  });

  it('should return the downscaled size with the same aspect ratio when both width and height are specified', () => {
    const origin = { width: 1200, height: 800 };
    const resizing = { width: 600, height: 400 };
    const expected = { width: 600, height: 400 };
    const result = getDownscaleSize(origin, resizing);
    expect(result).toEqual(expected);
  });

  it('should return the downscaled size with the same aspect ratio when the maximum size is larger than the original size', () => {
    const origin = { width: 600, height: 400 };
    const resizing = { width: 1200, height: 800 };
    const expected = { width: 600, height: 400 };
    const result = getDownscaleSize(origin, resizing);
    expect(result).toEqual(expected);
  });

  it('should return the downscaled size with the same aspect ratio when the aspect ratio of the resizing is different from the original size', () => {
    const origin = { width: 1200, height: 800 };
    const resizing = { width: 800, height: 600 };
    const expected = { width: 800, height: 533.3333333333334 };
    const result = getDownscaleSize(origin, resizing);
    expect(result.width).toEqual(expected.width);
    expect(result.width).toBeCloseTo(expected.width, 6);
  });
});

describe('normalizeFileName', () => {
  it('should append extension to filename if it does not exist', () => {
    const fileName = 'testFile';
    const extension = 'txt';
    const result = normalizeFileName(fileName, extension);
    expect(result).toEqual(`${fileName}.${extension}`);
  });

  it('should append dot+extension to filename if it does not exist', () => {
    const fileName = 'testFile';
    const extension = '.txt';
    const result = normalizeFileName(fileName, extension);
    expect(result).toEqual(`${fileName}${extension}`);
  });

  it('should return filename as is if it already contains extension', () => {
    const fileName = 'testFile.txt';
    const extension = 'txt';
    const result = normalizeFileName(fileName, extension);
    expect(result).toEqual(fileName);
  });

  it('should handle extensions with leading period', () => {
    const fileName = 'testFile';
    const extension = '.md';
    const result = normalizeFileName(fileName, extension);
    expect(result).toEqual(`${fileName}.md`);
  });

  it('should handle uppercase extension', () => {
    const fileName = 'testFile';
    const extension = 'JPG';
    const result = normalizeFileName(fileName, extension);
    expect(result).toEqual(`${fileName}.jpg`);
  });
});

describe('parseMimeType', () => {
  test('should parse a simple MIME type', () => {
    const mimeType = 'text/plain';
    const expected = { type: 'text', subtype: 'plain', parameters: {} };
    const result = parseMimeType(mimeType);
    expect(result).toEqual(expected);
  });

  test('should parse a MIME type with parameters', () => {
    const mimeType = 'image/jpeg; quality=80';
    const expected = { type: 'image', subtype: 'jpeg', parameters: { quality: '80' } };
    const result = parseMimeType(mimeType);
    expect(result).toEqual(expected);
  });

  test('should parse a MIME type with multiple parameters', () => {
    const mimeType = 'application/json; charset=utf-8; version=1.0';
    const expected = { type: 'application', subtype: 'json', parameters: { charset: 'utf-8', version: '1.0' } };
    const result = parseMimeType(mimeType);
    expect(result).toEqual(expected);
  });
});

describe('getFileExtensionFromMime', () => {
  it('should return empty string for undefined mime type', () => {
    expect(getFileExtensionFromMime(undefined)).toBe('');
  });

  it('should return empty string for null mime type', () => {
    expect(getFileExtensionFromMime(null)).toBe('');
  });

  it('should return correct extension for known mime type', () => {
    expect(getFileExtensionFromMime('image/jpeg')).toMatch(/\.jpg|\.jpeg/);
    expect(getFileExtensionFromMime('video/mp4')).toBe('.mp4');
    expect(getFileExtensionFromMime('audio/mpeg')).toBe('.mp3');
    expect(getFileExtensionFromMime('text/plain')).toBe('.txt');
    expect(getFileExtensionFromMime('application/pdf')).toBe('.pdf');
    expect(getFileExtensionFromMime('application/vnd.ms-excel')).toBe('.xls');
  });

  it('should return empty string for unknown mime type', () => {
    expect(getFileExtensionFromMime('unknown/type')).toBe('');
  });
});

describe('getMimeFromFileExtension', () => {
  it('should return the correct MIME type for a given file extension', () => {
    expect(getMimeFromFileExtension('pdf')).toEqual('application/pdf');
    expect(getMimeFromFileExtension('jpg')).toEqual('image/jpeg');
    expect(getMimeFromFileExtension('docx')).toEqual(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });

  it('should return the correct MIME type for a given file extension with dot', () => {
    expect(getMimeFromFileExtension('..pdf')).toEqual('application/pdf');
    expect(getMimeFromFileExtension('.jpg')).toEqual('image/jpeg');
    expect(getMimeFromFileExtension('.docx')).toEqual(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });

  it('should return an empty string for null or undefined input', () => {
    expect(getMimeFromFileExtension(null)).toEqual('');
    expect(getMimeFromFileExtension(undefined)).toEqual('');
  });

  it('should return an empty string for unsupported file extensions', () => {
    expect(getMimeFromFileExtension('css')).toEqual('');
    expect(getMimeFromFileExtension('html')).toEqual('');
  });
});

describe('getFileExtension', () => {
  it('should return the correct file extension for a given file path', () => {
    expect(getFileExtension('/path/to/file.pdf')).toEqual('.pdf');
    expect(getFileExtension('/path/to/image.JPG')).toEqual('.jpg');
    expect(getFileExtension('/path/to/doc.docx')).toEqual('.docx');
  });

  it('should return the correct file extension for a given file name', () => {
    expect(getFileExtension('file.pdf')).toEqual('.pdf');
    expect(getFileExtension('image.JPG')).toEqual('.jpg');
    expect(getFileExtension('doc.docx')).toEqual('.docx');
  });

  it('should return an empty string if the input does not contain a file extension', () => {
    expect(getFileExtension('/path/to/file')).toEqual('');
    expect(getFileExtension('/path/to/file.')).toEqual('');
    expect(getFileExtension('/path/to/file/')).toEqual('');
  });

  it('should remove the query string from the file path', () => {
    expect(getFileExtension('/path/to/file.pdf?query=string')).toEqual('.pdf');
    expect(getFileExtension('/path/to/file.jpg?query=string;key=test123')).toEqual('.jpg');
    expect(getFileExtension('/path/to/file?query=string;key=test123')).toEqual('');
  });
});

describe('getFileExtensionFromUri', () => {
  it('should return the correct file extension for a given file uri', async () => {
    await expect(
      getFileExtensionFromUri(
        'https://user-images.githubusercontent.com/26326015/253041267-4fd6c9f8-7bb4-4197-813c-43a45d0de95e.png',
      ),
    ).resolves.toEqual('.png');
    await expect(
      getFileExtensionFromUri(
        'https://user-images.githubusercontent.com/26326015/253041558-3028125e-a016-402c-a9bd-d30b1831d19b.jpg',
      ),
    ).resolves.toEqual('.jpg');
  });
});

describe('shouldCompressImage', () => {
  it('should allow image compression for jpg, jpeg, png', () => {
    expect(shouldCompressImage('image/jpeg')).toBe(true);
    expect(shouldCompressImage('image/png')).toBe(true);
  });
  it('should accept edge cases for jpg', () => {
    expect(shouldCompressImage('image/jpg')).toBe(true);
  });
  it('should not allow image compression for other MIME types', () => {
    expect(shouldCompressImage('image/gif')).toBe(false);
    expect(shouldCompressImage('video/mp4')).toBe(false);
    expect(shouldCompressImage('audio/mpeg')).toBe(false);
    expect(shouldCompressImage('application/pdf')).toBe(false);
  });
  it('should return false with compression disabled', () => {
    expect(shouldCompressImage('image/jpeg', false)).not.toBe(true);
    expect(shouldCompressImage('image/jpg', false)).not.toBe(true);
    expect(shouldCompressImage('image/png', false)).not.toBe(true);
  });
});
