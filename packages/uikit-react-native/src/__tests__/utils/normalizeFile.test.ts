import normalizeFile from '../../utils/normalizeFile';

const Images = {
  png: 'https://user-images.githubusercontent.com/26326015/253041267-4fd6c9f8-7bb4-4197-813c-43a45d0de95e.png',
  jpeg: 'https://user-images.githubusercontent.com/26326015/253041558-3028125e-a016-402c-a9bd-d30b1831d19b.jpg',
};

describe('normalizeFile', () => {
  const dateNow = Date.now();

  beforeAll(() => {
    Date.now = jest.fn(() => dateNow);
  });

  it('should return null if uri is not provided', async () => {
    const result = await normalizeFile({ uri: null, size: null, name: null, type: null });
    expect(result).toBeNull();
  });

  it('should return size as 0 if size is not provided', async () => {
    const result = await normalizeFile({ uri: 'uri', size: null, name: null, type: 'image/png' });
    expect(result?.size).toBe(0);
  });

  it('should set name as current timestamp if name is not provided', async () => {
    const result = await normalizeFile({ uri: 'uri', size: null, name: null, type: 'image/png' });
    expect(result).toStrictEqual({ uri: 'uri', size: 0, name: `${dateNow}.png`, type: 'image/png' });
  });

  it('should file name contain extension if type is provided', async () => {
    const result = await normalizeFile({ uri: 'uri', size: null, name: 'filename', type: 'image/png' });
    expect(result).toStrictEqual({ uri: 'uri', size: 0, name: 'filename.png', type: 'image/png' });
  });

  it('should not override extension of name if name already has extension', async () => {
    const withExtName = await normalizeFile({ uri: Images.jpeg, size: 1, name: 'fileName.jpeg', type: 'image/png' });
    expect(withExtName).toStrictEqual({ uri: Images.jpeg, size: 1, name: 'fileName.jpeg', type: 'image/png' });
  });

  it('should get type from extension of name if type is invalid', async () => {
    const emptyResult = await normalizeFile({ uri: 'uri', size: null, name: 'fromName.png', type: '' });
    expect(emptyResult).toStrictEqual({ uri: 'uri', size: 0, name: 'fromName.png', type: 'image/png' });

    const nullResult = await normalizeFile({ uri: 'uri', size: null, name: 'fromName.jpeg', type: null });
    expect(nullResult).toStrictEqual({ uri: 'uri', size: 0, name: 'fromName.jpeg', type: 'image/jpeg' });

    const undefResult = await normalizeFile({ uri: 'uri', size: null, name: 'fromName.gif', type: undefined });
    expect(undefResult).toStrictEqual({ uri: 'uri', size: 0, name: 'fromName.gif', type: 'image/gif' });

    const invalidResult = await normalizeFile({ uri: 'uri', size: null, name: 'fromName.pdf', type: 'invalid' });
    expect(invalidResult).toStrictEqual({ uri: 'uri', size: 0, name: 'fromName.pdf', type: 'application/pdf' });
  });

  it('should get type from uri if name and type are invalid', async () => {
    const emptyResult = await normalizeFile({ uri: Images.png, size: 111, name: '', type: '' });
    expect(emptyResult).toStrictEqual({ uri: Images.png, size: 111, name: `${dateNow}.png`, type: 'image/png' });

    const nullResult = await normalizeFile({ uri: Images.jpeg, size: 222, name: null, type: null });
    expect(nullResult).toStrictEqual({ uri: Images.jpeg, size: 222, name: `${dateNow}.jpg`, type: 'image/jpeg' });

    const undefResult = await normalizeFile({ uri: Images.jpeg, size: 333, name: undefined, type: undefined });
    expect(undefResult).toStrictEqual({ uri: Images.jpeg, size: 333, name: `${dateNow}.jpg`, type: 'image/jpeg' });

    const invalidResult = await normalizeFile({ uri: Images.jpeg, size: null, name: 'name', type: 'invalid' });
    expect(invalidResult).toStrictEqual({ uri: Images.jpeg, size: 0, name: 'name.jpg', type: 'image/jpeg' });

    const invalidResult2 = await normalizeFile({ uri: Images.jpeg, size: null, name: 'name.jpeg', type: 'invalid' });
    expect(invalidResult2).toStrictEqual({ uri: Images.jpeg, size: 0, name: 'name.jpeg', type: 'image/jpeg' });
  });
});
