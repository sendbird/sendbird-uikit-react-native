import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Sendbird from 'sendbird';

import type { HeaderStyleContextType, UIKitTheme } from '@sendbird/uikit-react-native-foundation';
import {
  DialogProvider,
  Header,
  HeaderStyleProvider,
  LightUIKitTheme,
  ToastProvider,
  UIKitThemeProvider,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

import InternalErrorBoundary from './InternalErrorBoundary';
import InternalLocalCacheStorage from './InternalLocalCacheStorage';
import { LocalizationProvider } from './contexts/Localization';
import { PlatformServiceProvider } from './contexts/PlatformService';
import { SendbirdChatProvider } from './contexts/SendbirdChat';
import { useLocalization } from './hooks/useContext';
import StringSetEn from './localization/StringSet.en';
import type { StringSet } from './localization/StringSet.type';
import SBUDynamicModule from './platform/dynamicModule';
import type { ClipboardServiceInterface, FileServiceInterface, NotificationServiceInterface } from './platform/types';
import type { ErrorBoundaryProps, LocalCacheStorage } from './types';
import VERSION from './version';

const NetInfo = SBUDynamicModule.get('@react-native-community/netinfo', 'warn');

export const SendbirdUIKit = Object.freeze({
  VERSION,
  PLATFORM: Platform.OS.toLowerCase(),
});

export type SendbirdUIKitContainerProps = {
  children?: React.ReactNode;
  appId: string;
  platformServices: {
    file: FileServiceInterface;
    notification: NotificationServiceInterface;
    clipboard: ClipboardServiceInterface;
  };
  chatOptions?: {
    localCacheStorage?: LocalCacheStorage;
    enableAutoPushTokenRegistration?: boolean;
    onInitialized?: (sdkInstance: SendbirdChatSDK) => SendbirdChatSDK;
  };
  localization?: {
    stringSet?: StringSet;
  };
  styles?: {
    theme?: UIKitTheme;
    statusBarTranslucent?: boolean;
    defaultHeaderTitleAlign?: 'left' | 'center';
    HeaderComponent?: HeaderStyleContextType['HeaderComponent'];
  };
  toast?: {
    dismissTimeout?: number;
  };
  errorBoundary?: {
    onError?: (props: ErrorBoundaryProps) => void;
    ErrorInfoComponent?: (props: ErrorBoundaryProps) => JSX.Element;
  };
};

const SendbirdUIKitContainer = ({
  children,
  appId,
  chatOptions,
  platformServices,
  localization,
  styles,
  toast,
  errorBoundary,
}: SendbirdUIKitContainerProps) => {
  const unsubscribes = useRef<(() => void)[]>([]).current;
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

    if (NetInfo) {
      const listener = (callback: () => void, callbackType: 'online' | 'offline') => {
        const unsubscribe = NetInfo.addEventListener((state) => {
          const online = Boolean(state.isConnected) || Boolean(state.isInternetReachable);
          if (online && callbackType === 'online') callback();
          if (!online && callbackType === 'offline') callback();
        });
        unsubscribes.push(unsubscribe);
        return unsubscribe;
      };
      sdk.setOnlineListener?.((onOnline) => listener(onOnline, 'online'));
      sdk.setOfflineListener?.((onOffline) => listener(onOffline, 'offline'));
    }
    return sdk;
  };

  const [sdkInstance, setSdkInstance] = useState<SendbirdChatSDK>(getSendbirdSDK);

  useEffect(() => {
    setSdkInstance(getSendbirdSDK);
    return () => {
      unsubscribes.forEach((u) => {
        try {
          u();
        } catch {}
      });
    };
  }, [appId, chatOptions?.localCacheStorage]);

  return (
    <SafeAreaProvider>
      <SendbirdChatProvider
        sdkInstance={sdkInstance}
        enableAutoPushTokenRegistration={chatOptions?.enableAutoPushTokenRegistration ?? true}
      >
        <LocalizationProvider stringSet={localization?.stringSet ?? StringSetEn}>
          <PlatformServiceProvider
            fileService={platformServices.file}
            notificationService={platformServices.notification}
            clipboardService={platformServices.clipboard}
          >
            <UIKitThemeProvider theme={styles?.theme ?? LightUIKitTheme}>
              <HeaderStyleProvider
                HeaderComponent={styles?.HeaderComponent ?? Header}
                defaultTitleAlign={styles?.defaultHeaderTitleAlign ?? 'left'}
                statusBarTranslucent={styles?.statusBarTranslucent ?? true}
              >
                <LocalizedDialogProvider>
                  <ToastProvider dismissTimeout={toast?.dismissTimeout}>
                    <InternalErrorBoundary {...errorBoundary}>{children}</InternalErrorBoundary>
                  </ToastProvider>
                </LocalizedDialogProvider>
              </HeaderStyleProvider>
            </UIKitThemeProvider>
          </PlatformServiceProvider>
        </LocalizationProvider>
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
