import {
  GiphyDialog,
  GiphyDialogEvent,
  GiphyFileExtension,
  GiphyMedia,
  GiphySDK,
  GiphyThemePreset,
} from '@giphy/react-native-sdk';

interface FileMessageParamsForGiphy {
  url: string;
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

        if (e.media.data.type === 'gif') {
          resolve({
            url: e.media.url,
            size: Number(e.media.data.images.original.size ?? 0),
            type: 'image/gif',
          });
        } else {
          reject(new Error('Invalid data type'));
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
