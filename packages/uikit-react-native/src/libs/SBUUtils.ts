import { Image, Linking, Platform } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

export default class SBUUtils {
  static openSettings() {
    Linking.openSettings().catch(() => {
      if (Platform.OS === 'ios') Linking.openURL('App-Prefs:root');
    });
  }

  static openURL(url: string) {
    const targetUrl = url.startsWith('http') ? url : 'https://' + url;
    Linking.openURL(targetUrl).catch((err) => Logger.warn('Cannot open url', err));
  }

  static getImageSize(uri: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => {
          resolve({ width, height });
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  static async safeRun(callback: () => Promise<void>) {
    try {
      await callback();
    } catch (e) {}
  }
}
