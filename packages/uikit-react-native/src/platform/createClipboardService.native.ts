import type Clipboard from '@react-native-clipboard/clipboard';

import type { ClipboardServiceInterface } from './types';

const createNativeClipboardService = (clipboardModule: typeof Clipboard): ClipboardServiceInterface => {
  return {
    getString(): Promise<string> {
      return clipboardModule.getString();
    },
    setString(text: string) {
      return clipboardModule.setString(text);
    },
  };
};

export default createNativeClipboardService;
