import {
  GiphyDialog,
  GiphyDialogEvent,
  GiphyFileExtension,
  GiphyMedia,
  GiphySDK,
  GiphyThemePreset,
} from '@giphy/react-native-sdk';

import { Logger, getFileExtension, normalizeFileName } from '@sendbird/uikit-utils';

interface FileMessageParamsForGiphy {
  name: string;
  uri: string;
  size: number;
  type: 'image/gif';
}

export interface GiphyServiceInterface {
  apiKey: string;
  openDialog(): Promise<FileMessageParamsForGiphy>;
  updateDialogConfig(options: Partial<{ theme: 'light' | 'dark' }>): void;
}

export class GiphyService implements GiphyServiceInterface {
  constructor(public apiKey: string) {
    GiphySDK.configure({ apiKey });
    GiphyDialog.configure({ fileType: GiphyFileExtension.GIF });
  }

  openDialog(): Promise<FileMessageParamsForGiphy> {
    return new Promise((resolve, reject) => {
      const selectSubscribe = GiphyDialog.addListener(GiphyDialogEvent.MediaSelected, (e: { media: GiphyMedia }) => {
        GiphyDialog.hide();

        const media = e.media.data.images.fixed_width;
        const ext = getFileExtension(media.url).slice(1);
        if (ext === 'gif') {
          resolve({
            name: normalizeFileName(e.media.data.title, 'gif'),
            uri: media.url,
            type: 'image/gif',
            size: Number(media.size ?? 0),
          });
        } else {
          const message = 'Selected media is not GIF';
          Logger.warn(message, e.media.url, e.media.data.type);
          reject(new Error(message));
        }
      });

      const dismissSubscribe = GiphyDialog.addListener(GiphyDialogEvent.Dismissed, () => {
        selectSubscribe.remove();
        dismissSubscribe.remove();
      });

      GiphyDialog.show();
    });
  }

  updateDialogConfig(options: Partial<{ theme: 'light' | 'dark' }>) {
    if (options.theme) {
      const themePreset = { light: GiphyThemePreset.Light, dark: GiphyThemePreset.Dark };
      GiphyDialog.configure({ theme: themePreset[options.theme] });
    }
  }
}
