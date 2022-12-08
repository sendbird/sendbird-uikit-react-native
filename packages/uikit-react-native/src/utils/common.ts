import { Linking } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

export const openUrl = (url: string) => {
  const targetUrl = url.startsWith('http') ? url : 'https://' + url;
  Linking.openURL(targetUrl).catch((err) => Logger.warn('Cannot open url', err));
};
