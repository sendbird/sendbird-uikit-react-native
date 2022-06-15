import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Sendbird from 'sendbird';

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

type LabelSets = Record<string, LabelSet>;
type Props<T extends LabelSets> = {
  children?: React.ReactNode;
  appId: string;
  appVersion?: string;
  chatOptions?: {
    onInitialized?: (sdkInstance: SendbirdChatSDK) => SendbirdChatSDK;
    localCacheStorage?: LocalCacheStorage;
    autoPushTokenRegistration?: boolean;
  };
  platformServices: {
    file: FileServiceInterface;
    notification: NotificationServiceInterface;
    clipboard: ClipboardServiceInterface;
  };
  localization?: {
    labelSet?: T;
    defaultLocale?: keyof T;
  };
  styles?: {
    theme?: UIKitTheme;
    statusBarTranslucent?: boolean;
    defaultHeaderTitleAlign?: 'left' | 'center' | 'right';
  };
  onError?: (props: ErrorBoundaryProps) => void;
  ErrorInfoComponent?: (props: ErrorBoundaryProps) => JSX.Element;
};

const SendbirdUIKitContainer = <T extends LabelSets>({
  children,
  appId,
  appVersion,
  chatOptions,
  platformServices,
  localization,
  styles,
  onError,
  ErrorInfoComponent,
}: Props<T>) => {
  const [sdkInstance, setSdkInstance] = useState<SendbirdChatSDK>();

  useEffect(() => {
    if (appVersion) Sendbird.setAppVersion(appVersion);
  }, [appVersion]);

  useEffect(() => {
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

    setSdkInstance(sdk);
  }, [appId, chatOptions?.localCacheStorage]);

  if (!sdkInstance) return null;

  return (
    <SafeAreaProvider>
      <SendbirdChatProvider
        sdkInstance={sdkInstance}
        autoPushTokenRegistration={chatOptions?.autoPushTokenRegistration ?? true}
      >
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
                fileService={platformServices.file}
                notificationService={platformServices.notification}
                clipboardService={platformServices.clipboard}
              >
                <LocalizedDialogProvider>
                  <ToastProvider>
                    <InternalErrorBoundary onError={onError} ErrorInfoComponent={ErrorInfoComponent}>
                      {children}
                    </InternalErrorBoundary>
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
