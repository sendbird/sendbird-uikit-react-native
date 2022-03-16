import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import type { UIKitTheme } from '@sendbird/uikit-react-native-foundation';
import {
  DialogProvider,
  HeaderStyleProvider,
  LightUIKitTheme,
  UIKitThemeProvider,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

type Props<Locale extends string> = {
  children?: React.ReactNode;
  chat: {
    sdkInstance: SendbirdChatSDK;
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
    defaultHeaderTitleAlign?: 'left' | 'center' | 'right';
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
          <HeaderStyleProvider
            defaultTitleAlign={styles?.defaultHeaderTitleAlign ?? 'left'}
            statusBarTranslucent={styles?.statusBarTranslucent ?? true}
          >
            <LocalizationProvider
              defaultLocale={(localization?.defaultLocale ?? 'en') as 'en'}
              labelSet={(localization?.labelSet ?? { en: LabelEn }) as { en: LabelSet }}
            >
              <PlatformServiceProvider
                filePickerService={services.filePicker}
                notificationService={services.notification}
              >
                <DialogProvider>{children}</DialogProvider>
              </PlatformServiceProvider>
            </LocalizationProvider>
          </HeaderStyleProvider>
        </UIKitThemeProvider>
      </SendbirdChatProvider>
    </SafeAreaProvider>
  );
};

export default SendbirdUIKitContainer;
