import type * as Clipboard from 'expo-clipboard';

import type { ClipboardServiceInterface } from './types';

type ExpoClipboardModule = typeof Clipboard & {
  setString?: (text: string) => void;
};

const createExpoClipboardService = (clipboardModule: typeof Clipboard): ClipboardServiceInterface => {
  const expoClipboardModule = clipboardModule as ExpoClipboardModule;

  return {
    getString(): Promise<string> {
      return clipboardModule.getStringAsync();
    },
    setString(text: string) {
      if (typeof expoClipboardModule.setString === 'function') {
        expoClipboardModule.setString(text);
        return;
      }

      void clipboardModule.setStringAsync(text);
    },
  };
};

export default createExpoClipboardService;
