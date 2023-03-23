import {
  getDownscaleSize,
  getFileExtension,
  getFileExtensionFromMime,
  getMimeFromFileExtension,
  normalizeFileName,
  parseMimeType,
} from '../../shared/file';

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
    expect(getFileExtensionFromMime('image/jpeg')).toMatch(/jpg|jpeg/);
    expect(getFileExtensionFromMime('video/mp4')).toBe('mp4');
    expect(getFileExtensionFromMime('audio/mpeg')).toBe('mp3');
    expect(getFileExtensionFromMime('text/plain')).toBe('txt');
    expect(getFileExtensionFromMime('application/pdf')).toBe('pdf');
    expect(getFileExtensionFromMime('application/vnd.ms-excel')).toBe('xls');
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
