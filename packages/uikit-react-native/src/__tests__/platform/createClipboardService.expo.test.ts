import createExpoClipboardService from '../../platform/createClipboardService.expo';

describe('createExpoClipboardService', () => {
  it('uses setStringAsync when Expo Clipboard does not provide setString', () => {
    const clipboardModule = {
      getStringAsync: jest.fn(),
      setStringAsync: jest.fn(),
    };

    const clipboardService = createExpoClipboardService(clipboardModule as never);

    clipboardService.setString('message');

    expect(clipboardModule.setStringAsync).toHaveBeenCalledWith('message');
  });
});
