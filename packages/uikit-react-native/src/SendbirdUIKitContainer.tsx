import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type {
  FilePickerServiceInterface,
  LabelLocale,
  LabelSet,
  NotificationServiceInterface,
} from '@sendbird/uikit-react-native-core';
import {
  LabelEn,
  LocalizationProvider,
  PlatformServiceProvider,
  SendbirdChatProvider,
} from '@sendbird/uikit-react-native-core';

import { HeaderStyleProvider } from './styles/HeaderStyleContext';
import LightUIKitTheme from './theme/LightUIKitTheme';
import UIKitThemeProvider from './theme/UIKitThemeProvider';
import type { UIKitTheme } from './types';

type Props<T extends string = LabelLocale> = {
  appId: string;
  localCacheEnabled?: boolean;
  theme?: UIKitTheme;
  services: {
    filePicker: FilePickerServiceInterface;
    notification: NotificationServiceInterface;
  };
  localization?: {
    defaultLocale?: T;
    labelSet?: Record<T, LabelSet>;
  };
  styles?: {
    statusBarTranslucent?: boolean;
  };
};

const SendbirdUIKitContainer: React.FC<Props> = ({
  appId,
  localCacheEnabled,
  theme,
  services,
  localization,
  styles,
  children,
}) => {
  return (
    <SafeAreaProvider>
      <SendbirdChatProvider appId={appId} localCacheEnabled={localCacheEnabled}>
        <UIKitThemeProvider theme={theme ?? LightUIKitTheme}>
          <HeaderStyleProvider statusBarTranslucent={styles?.statusBarTranslucent ?? true}>
            <LocalizationProvider
              defaultLocale={localization?.defaultLocale ?? 'en'}
              labelSet={localization?.labelSet ?? { en: LabelEn }}
            >
              <PlatformServiceProvider
                filePickerService={services.filePicker}
                notificationService={services.notification}
              >
                {children}
              </PlatformServiceProvider>
            </LocalizationProvider>
          </HeaderStyleProvider>
        </UIKitThemeProvider>
      </SendbirdChatProvider>
    </SafeAreaProvider>
  );
};

export default SendbirdUIKitContainer;
