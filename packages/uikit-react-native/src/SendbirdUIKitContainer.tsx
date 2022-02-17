import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type Sendbird from 'sendbird';

import type {
  FilePickerServiceInterface,
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

type Props<Locale extends string> = {
  children?: React.ReactNode;
  chat: {
    sdkInstance: Sendbird.SendBirdInstance;
  };
  services: {
    filePicker: FilePickerServiceInterface;
    notification: NotificationServiceInterface;
  };
  localization?: {
    defaultLocale?: Locale;
    labelSet?: Record<Locale, LabelSet>;
  };
  styles?: {
    theme?: UIKitTheme;
    statusBarTranslucent?: boolean;
  };
};

const SendbirdUIKitContainer = <Locale extends string>({
  chat,
  services,
  localization,
  styles,
  children,
}: Props<Locale>) => {
  return (
    <SafeAreaProvider>
      <SendbirdChatProvider sdkInstance={chat.sdkInstance}>
        <UIKitThemeProvider theme={styles?.theme ?? LightUIKitTheme}>
          <HeaderStyleProvider statusBarTranslucent={styles?.statusBarTranslucent ?? true}>
            <LocalizationProvider
              defaultLocale={(localization?.defaultLocale ?? 'en') as 'en'}
              labelSet={(localization?.labelSet ?? { en: LabelEn }) as { en: LabelSet }}
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
