import type * as Clipboard from 'expo-clipboard';

import type { ClipboardServiceInterface } from './types';

const createExpoClipboardService = (clipboardModule: typeof Clipboard): ClipboardServiceInterface => {
  return {
    getString(): Promise<string> {
      return clipboardModule.getStringAsync();
    },
    setString(text: string) {
      return clipboardModule.setString(text);
    },
  };
};

export default createExpoClipboardService;
