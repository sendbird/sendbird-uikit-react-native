import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type {
  ClipboardServiceInterface,
  FileServiceInterface,
  LabelSet,
  NotificationServiceInterface,
} from '@sendbird/uikit-react-native-core';
import {
  LabelEn,
  LocalizationProvider,
  PlatformServiceProvider,
  SendbirdChatProvider,
  useLocalization,
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
    file: FileServiceInterface;
    notification: NotificationServiceInterface;
    clipboard: ClipboardServiceInterface;
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
                fileService={services.file}
                notificationService={services.notification}
                clipboardService={services.clipboard}
              >
                <LocalizedDialogProvider>{children}</LocalizedDialogProvider>
              </PlatformServiceProvider>
            </LocalizationProvider>
          </HeaderStyleProvider>
        </UIKitThemeProvider>
      </SendbirdChatProvider>
    </SafeAreaProvider>
  );
};

const LocalizedDialogProvider: React.FC = ({ children }) => {
  const { LABEL } = useLocalization();
  return (
    <DialogProvider
      defaultLabels={{
        alert: {
          ok: LABEL.DIALOG.ALERT_DEFAULT_OK,
        },
        prompt: {
          ok: LABEL.DIALOG.PROMPT_DEFAULT_OK,
          cancel: LABEL.DIALOG.PROMPT_DEFAULT_CANCEL,
          placeholder: LABEL.DIALOG.PROMPT_DEFAULT_PLACEHOLDER,
        },
      }}
    >
      {children}
    </DialogProvider>
  );
};

export default SendbirdUIKitContainer;
