import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Sendbird from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import type { HeaderStyleContextType, UIKitTheme } from '@sendbird/uikit-react-native-foundation';
import {
  DialogProvider,
  Header,
  HeaderStyleProvider,
  LightUIKitTheme,
  ToastProvider,
  UIKitThemeProvider,
} from '@sendbird/uikit-react-native-foundation';
import type {
  SendbirdBaseChannel,
  SendbirdChatSDK,
  SendbirdGroupChannelCreateParams,
  SendbirdMember,
  SendbirdUser,
} from '@sendbird/uikit-utils';

import { LocalizationProvider } from '../contexts/LocalizationCtx';
import { PlatformServiceProvider } from '../contexts/PlatformServiceCtx';
import { ProfileCardProvider } from '../contexts/ProfileCardCtx';
import type { UIKitFeaturesInSendbirdChatContext } from '../contexts/SendbirdChatCtx';
import { SendbirdChatProvider } from '../contexts/SendbirdChatCtx';
import { useLocalization } from '../hooks/useContext';
import InternalLocalCacheStorage from '../libs/InternalLocalCacheStorage';
import StringSetEn from '../localization/StringSet.en';
import type { StringSet } from '../localization/StringSet.type';
import SBUDynamicModule from '../platform/dynamicModule';
import type {
  ClipboardServiceInterface,
  FileServiceInterface,
  MediaServiceInterface,
  NotificationServiceInterface,
} from '../platform/types';
import type { ErrorBoundaryProps, LocalCacheStorage } from '../types';
import VERSION from '../version';
import InternalErrorBoundaryContainer from './InternalErrorBoundaryContainer';

const NetInfo = SBUDynamicModule.get('@react-native-community/netinfo', 'warn');

export const SendbirdUIKit = Object.freeze({
  VERSION,
  PLATFORM: Platform.OS.toLowerCase(),
});

export type SendbirdUIKitContainerProps = React.PropsWithChildren<{
  appId: string;
  platformServices: {
    file: FileServiceInterface;
    notification: NotificationServiceInterface;
    clipboard: ClipboardServiceInterface;
    media?: MediaServiceInterface;
  };
  chatOptions?: {
    localCacheStorage?: LocalCacheStorage;
    onInitialized?: (sdkInstance: SendbirdChatSDK) => SendbirdChatSDK;
  } & Partial<UIKitFeaturesInSendbirdChatContext>;
  localization?: {
    stringSet?: StringSet;
  };
  styles?: {
    theme?: UIKitTheme;
    statusBarTranslucent?: boolean;
    defaultHeaderTitleAlign?: 'left' | 'center';
    defaultHeaderHeight?: number;
    HeaderComponent?: HeaderStyleContextType['HeaderComponent'];
  };
  toast?: {
    dismissTimeout?: number;
  };
  profileCard?: {
    onCreateChannel: (channel: SendbirdBaseChannel) => void;
    onBeforeCreateChannel?: (
      channelParams: SendbirdGroupChannelCreateParams,
      users: SendbirdUser[] | SendbirdMember[],
    ) => SendbirdGroupChannelCreateParams | Promise<SendbirdGroupChannelCreateParams>;
  };
  errorBoundary?: {
    onError?: (props: ErrorBoundaryProps) => void;
    ErrorInfoComponent?: (props: ErrorBoundaryProps) => JSX.Element;
  };
}>;

const SendbirdUIKitContainer = ({
  children,
  appId,
  chatOptions,
  platformServices,
  localization,
  styles,
  toast,
  profileCard,
  errorBoundary,
}: SendbirdUIKitContainerProps) => {
  const unsubscribes = useRef<(() => void)[]>([]).current;
  const getSendbirdSDK = () => {
    let sdk: SendbirdChatSDK;

    sdk = Sendbird.init({
      appId,
      modules: [new GroupChannelModule(), new OpenChannelModule()],
      localCacheEnabled: Boolean(chatOptions?.localCacheStorage),
      // @ts-ignore
      useAsyncStorageStore: chatOptions?.localCacheStorage
        ? new InternalLocalCacheStorage(chatOptions.localCacheStorage)
        : undefined,
    });

    if (chatOptions?.onInitialized) {
      sdk = chatOptions?.onInitialized(sdk);
    }

    if (SendbirdUIKit.VERSION) {
      sdk.addExtension('sb_uikit', SendbirdUIKit.VERSION);
    }

    if (SendbirdUIKit.PLATFORM) {
      sdk.addExtension('device-os-platform', SendbirdUIKit.PLATFORM);
    }

    if (NetInfo?.addEventListener) {
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
        enableChannelListTypingIndicator={chatOptions?.enableChannelListTypingIndicator ?? false}
        enableChannelListMessageReceiptStatus={chatOptions?.enableChannelListMessageReceiptStatus ?? false}
        enableUseUserIdForNickname={chatOptions?.enableUseUserIdForNickname ?? false}
      >
        <LocalizationProvider stringSet={localization?.stringSet ?? StringSetEn}>
          <PlatformServiceProvider
            fileService={platformServices.file}
            notificationService={platformServices.notification}
            clipboardService={platformServices.clipboard}
            mediaService={platformServices.media}
          >
            <UIKitThemeProvider theme={styles?.theme ?? LightUIKitTheme}>
              <HeaderStyleProvider
                HeaderComponent={styles?.HeaderComponent ?? Header}
                defaultTitleAlign={styles?.defaultHeaderTitleAlign ?? 'left'}
                statusBarTranslucent={styles?.statusBarTranslucent ?? true}
              >
                <LocalizedDialogProvider>
                  <ToastProvider dismissTimeout={toast?.dismissTimeout}>
                    <ProfileCardProvider
                      onCreateChannel={profileCard?.onCreateChannel}
                      onBeforeCreateChannel={profileCard?.onBeforeCreateChannel}
                    >
                      <InternalErrorBoundaryContainer {...errorBoundary}>{children}</InternalErrorBoundaryContainer>
                    </ProfileCardProvider>
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

const LocalizedDialogProvider = ({ children }: React.PropsWithChildren) => {
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
