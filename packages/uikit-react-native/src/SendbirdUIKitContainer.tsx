import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Sendbird from 'sendbird';

import type {
  ClipboardServiceInterface,
  FileServiceInterface,
  NotificationServiceInterface,
  StringSet,
} from '@sendbird/uikit-react-native-core';
import {
  LocalizationProvider,
  PlatformServiceProvider,
  SendbirdChatProvider,
  StringSetEn,
  useLocalization,
} from '@sendbird/uikit-react-native-core';
import type { UIKitTheme } from '@sendbird/uikit-react-native-foundation';
import {
  DialogProvider,
  HeaderStyleProvider,
  LightUIKitTheme,
  ToastProvider,
  UIKitThemeProvider,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

import InternalErrorBoundary from './InternalErrorBoundary';
import InternalLocalCacheStorage from './InternalLocalCacheStorage';
import type { ErrorBoundaryProps, LocalCacheStorage } from './types';
import VERSION from './version';

export const SendbirdUIKit = Object.freeze({
  VERSION,
  PLATFORM: Platform.OS.toLowerCase(),
});

type StringSets = Record<string, StringSet>;
type Props<T extends StringSets> = {
  children?: React.ReactNode;
  appId: string;
  appVersion?: string;
  chatOptions?: {
    onInitialized?: (sdkInstance: SendbirdChatSDK) => SendbirdChatSDK;
    localCacheStorage?: LocalCacheStorage;
    enableAutoPushTokenRegistration?: boolean;
  };
  platformServices: {
    file: FileServiceInterface;
    notification: NotificationServiceInterface;
    clipboard: ClipboardServiceInterface;
  };
  localization?: {
    stringSets?: T;
    defaultLocale?: keyof T;
  };
  styles?: {
    theme?: UIKitTheme;
    statusBarTranslucent?: boolean;
    defaultHeaderTitleAlign?: 'left' | 'center';
  };
  toast?: {
    dismissTimeout?: number;
  };
  errorBoundary?: {
    onError?: (props: ErrorBoundaryProps) => void;
    ErrorInfoComponent?: (props: ErrorBoundaryProps) => JSX.Element;
  };
};

const SendbirdUIKitContainer = <T extends StringSets>({
  children,
  appId,
  appVersion,
  chatOptions,
  platformServices,
  localization,
  styles,
  toast,
  errorBoundary,
}: Props<T>) => {
  const getSendbirdSDK = () => {
    let sdk: SendbirdChatSDK;

    if (chatOptions?.localCacheStorage) {
      sdk = new Sendbird({ appId, localCacheEnabled: true });
      sdk.useAsyncStorageAsDatabase(new InternalLocalCacheStorage(chatOptions.localCacheStorage));
    } else {
      sdk = new Sendbird({ appId });
    }

    if (chatOptions?.onInitialized) {
      sdk = chatOptions?.onInitialized(sdk);
    }

    if (SendbirdUIKit.VERSION) {
      // @ts-ignore
      sdk.addExtension('sb_uikit', SendbirdUIKit.VERSION);
    }
    if (SendbirdUIKit.PLATFORM) {
      // @ts-ignore
      sdk.addExtension('device-os-platform', SendbirdUIKit.PLATFORM);
    }

    return sdk;
  };

  const [sdkInstance, setSdkInstance] = useState<SendbirdChatSDK>(getSendbirdSDK);

  useEffect(() => {
    if (appVersion) Sendbird.setAppVersion(appVersion);
  }, [appVersion]);

  useEffect(() => {
    setSdkInstance(getSendbirdSDK);
  }, [appId, chatOptions?.localCacheStorage]);

  return (
    <SafeAreaProvider>
      <SendbirdChatProvider
        sdkInstance={sdkInstance}
        enableAutoPushTokenRegistration={chatOptions?.enableAutoPushTokenRegistration ?? true}
      >
        <UIKitThemeProvider theme={styles?.theme ?? LightUIKitTheme}>
          <HeaderStyleProvider
            defaultTitleAlign={styles?.defaultHeaderTitleAlign ?? 'left'}
            statusBarTranslucent={styles?.statusBarTranslucent ?? true}
          >
            <LocalizationProvider
              defaultLocale={(localization?.defaultLocale ?? 'en') as 'en'}
              stringSets={(localization?.stringSets ?? { en: StringSetEn }) as { en: StringSet }}
            >
              <PlatformServiceProvider
                fileService={platformServices.file}
                notificationService={platformServices.notification}
                clipboardService={platformServices.clipboard}
              >
                <LocalizedDialogProvider>
                  <ToastProvider dismissTimeout={toast?.dismissTimeout}>
                    <InternalErrorBoundary {...errorBoundary}>{children}</InternalErrorBoundary>
                  </ToastProvider>
                </LocalizedDialogProvider>
              </PlatformServiceProvider>
            </LocalizationProvider>
          </HeaderStyleProvider>
        </UIKitThemeProvider>
      </SendbirdChatProvider>
    </SafeAreaProvider>
  );
};

const LocalizedDialogProvider: React.FC = ({ children }) => {
  const { STRINGS } = useLocalization();
  return (
    <DialogProvider
      defaultLabels={{
        alert: {
          ok: STRINGS.DIALOG.ALERT_DEFAULT_OK,
        },
        prompt: {
          ok: STRINGS.DIALOG.PROMPT_DEFAULT_OK,
          cancel: STRINGS.DIALOG.PROMPT_DEFAULT_CANCEL,
          placeholder: STRINGS.DIALOG.PROMPT_DEFAULT_PLACEHOLDER,
        },
      }}
    >
      {children}
    </DialogProvider>
  );
};

export default SendbirdUIKitContainer;
