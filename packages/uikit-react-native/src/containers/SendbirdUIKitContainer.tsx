import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { useIsFirstMount } from '@sendbird/uikit-utils';

import { LocalizationContext, LocalizationProvider } from '../contexts/LocalizationCtx';
import { PlatformServiceProvider } from '../contexts/PlatformServiceCtx';
import { ReactionProvider } from '../contexts/ReactionCtx';
import type { UIKitFeaturesInSendbirdChatContext } from '../contexts/SendbirdChatCtx';
import { SendbirdChatProvider } from '../contexts/SendbirdChatCtx';
import { UserProfileProvider } from '../contexts/UserProfileCtx';
import EmojiManager from '../libs/EmojiManager';
import type { ImageCompressionConfigInterface } from '../libs/ImageCompressionConfig';
import ImageCompressionConfig from '../libs/ImageCompressionConfig';
import InternalLocalCacheStorage from '../libs/InternalLocalCacheStorage';
import MentionConfig, { MentionConfigInterface } from '../libs/MentionConfig';
import MentionManager from '../libs/MentionManager';
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
  DEFAULT: {
    AUTO_PUSH_TOKEN_REGISTRATION: true,
    CHANNEL_LIST_TYPING_INDICATOR: false,
    CHANNEL_LIST_MESSAGE_RECEIPT_STATUS: false,
    USE_USER_ID_FOR_NICKNAME: false,
    USER_MENTION: false,
    IMAGE_COMPRESSION: true,
  },
});

export type SendbirdUIKitContainerProps = React.PropsWithChildren<{
  appId: string;
  platformServices: {
    file: FileServiceInterface;
    notification: NotificationServiceInterface;
    clipboard: ClipboardServiceInterface;
    media: MediaServiceInterface;
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
  errorBoundary?: {
    onError?: (props: ErrorBoundaryProps) => void;
    ErrorInfoComponent?: (props: ErrorBoundaryProps) => JSX.Element;
  };
  toast?: {
    dismissTimeout?: number;
  };
  userProfile?: {
    onCreateChannel: (channel: SendbirdBaseChannel) => void;
    onBeforeCreateChannel?: (
      channelParams: SendbirdGroupChannelCreateParams,
      users: SendbirdUser[] | SendbirdMember[],
    ) => SendbirdGroupChannelCreateParams | Promise<SendbirdGroupChannelCreateParams>;
  };
  userMention?: Pick<Partial<MentionConfigInterface>, 'mentionLimit' | 'suggestionLimit' | 'debounceMills'>;
  imageCompression?: Partial<ImageCompressionConfigInterface>;
}>;

const SendbirdUIKitContainer = ({
  children,
  appId,
  chatOptions,
  platformServices,
  localization,
  styles,
  errorBoundary,
  toast,
  userProfile,
  userMention,
  imageCompression,
}: SendbirdUIKitContainerProps) => {
  const defaultStringSet = localization?.stringSet ?? StringSetEn;

  const isFirstMount = useIsFirstMount();
  const unsubscribes = useRef<Array<() => void>>([]);
  const internalStorage = useMemo(
    () => (chatOptions?.localCacheStorage ? new InternalLocalCacheStorage(chatOptions.localCacheStorage) : undefined),
    [chatOptions?.localCacheStorage],
  );

  const [sdkInstance, setSdkInstance] = useState<SendbirdChatSDK>(() => {
    const sendbird = initializeSendbird(appId, internalStorage, chatOptions?.onInitialized);
    unsubscribes.current = sendbird.unsubscribes;
    return sendbird.chatSDK;
  });

  const emojiManager = useMemo(() => new EmojiManager(internalStorage), [internalStorage]);

  const mentionManager = useMemo(() => {
    const config = new MentionConfig({
      mentionLimit: userMention?.mentionLimit || MentionConfig.DEFAULT.MENTION_LIMIT,
      suggestionLimit: userMention?.suggestionLimit || MentionConfig.DEFAULT.SUGGESTION_LIMIT,
      debounceMills: userMention?.debounceMills ?? MentionConfig.DEFAULT.DEBOUNCE_MILLS,
      delimiter: MentionConfig.DEFAULT.DELIMITER,
      trigger: MentionConfig.DEFAULT.TRIGGER,
    });
    return new MentionManager(config, chatOptions?.enableUserMention ?? SendbirdUIKit.DEFAULT.USER_MENTION);
  }, [userMention?.mentionLimit, userMention?.suggestionLimit, userMention?.debounceMills]);

  const imageCompressionConfig = useMemo(
    () =>
      new ImageCompressionConfig({
        compressionRate: imageCompression?.compressionRate || ImageCompressionConfig.DEFAULT.COMPRESSION_RATE,
        width: imageCompression?.width,
        height: imageCompression?.height,
      }),
    [imageCompression?.compressionRate, imageCompression?.width, imageCompression?.height],
  );

  useLayoutEffect(() => {
    if (!isFirstMount) {
      const sendbird = initializeSendbird(appId, internalStorage, chatOptions?.onInitialized);
      setSdkInstance(sendbird.chatSDK);
      unsubscribes.current = sendbird.unsubscribes;
    }

    return () => {
      if (!isFirstMount) {
        unsubscribes.current.forEach((u) => {
          try {
            u();
          } catch {}
        });
      }
    };
  }, [appId, internalStorage]);

  return (
    <SafeAreaProvider>
      <SendbirdChatProvider
        sdkInstance={sdkInstance}
        emojiManager={emojiManager}
        mentionManager={mentionManager}
        imageCompressionConfig={imageCompressionConfig}
        enableAutoPushTokenRegistration={
          chatOptions?.enableAutoPushTokenRegistration ?? SendbirdUIKit.DEFAULT.AUTO_PUSH_TOKEN_REGISTRATION
        }
        enableChannelListTypingIndicator={
          chatOptions?.enableChannelListTypingIndicator ?? SendbirdUIKit.DEFAULT.CHANNEL_LIST_TYPING_INDICATOR
        }
        enableChannelListMessageReceiptStatus={
          chatOptions?.enableChannelListMessageReceiptStatus ??
          SendbirdUIKit.DEFAULT.CHANNEL_LIST_MESSAGE_RECEIPT_STATUS
        }
        enableUseUserIdForNickname={
          chatOptions?.enableUseUserIdForNickname ?? SendbirdUIKit.DEFAULT.USE_USER_ID_FOR_NICKNAME
        }
        enableUserMention={chatOptions?.enableUserMention ?? SendbirdUIKit.DEFAULT.USER_MENTION}
        enableImageCompression={chatOptions?.enableImageCompression ?? SendbirdUIKit.DEFAULT.IMAGE_COMPRESSION}
      >
        <LocalizationProvider stringSet={defaultStringSet}>
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
                <ToastProvider dismissTimeout={toast?.dismissTimeout}>
                  <UserProfileProvider
                    onCreateChannel={userProfile?.onCreateChannel}
                    onBeforeCreateChannel={userProfile?.onBeforeCreateChannel}
                  >
                    <ReactionProvider>
                      <LocalizationContext.Consumer>
                        {(value) => {
                          const STRINGS = value?.STRINGS || defaultStringSet;
                          return (
                            <DialogProvider
                              defaultLabels={{
                                alert: { ok: STRINGS.DIALOG.ALERT_DEFAULT_OK },
                                prompt: {
                                  ok: STRINGS.DIALOG.PROMPT_DEFAULT_OK,
                                  cancel: STRINGS.DIALOG.PROMPT_DEFAULT_CANCEL,
                                  placeholder: STRINGS.DIALOG.PROMPT_DEFAULT_PLACEHOLDER,
                                },
                              }}
                            >
                              <InternalErrorBoundaryContainer {...errorBoundary}>
                                {children}
                              </InternalErrorBoundaryContainer>
                            </DialogProvider>
                          );
                        }}
                      </LocalizationContext.Consumer>
                    </ReactionProvider>
                  </UserProfileProvider>
                </ToastProvider>
              </HeaderStyleProvider>
            </UIKitThemeProvider>
          </PlatformServiceProvider>
        </LocalizationProvider>
      </SendbirdChatProvider>
    </SafeAreaProvider>
  );
};

const initializeSendbird = (
  appId: string,
  internalStorage?: InternalLocalCacheStorage,
  onInitialized?: (sdk: SendbirdChatSDK) => SendbirdChatSDK,
) => {
  const unsubscribes: Array<() => void> = [];
  let chatSDK: SendbirdChatSDK;

  chatSDK = Sendbird.init({
    appId,
    modules: [new GroupChannelModule(), new OpenChannelModule()],
    localCacheEnabled: Boolean(internalStorage),
    useAsyncStorageStore: internalStorage as never,
    newInstance: true,
  });

  if (onInitialized) {
    chatSDK = onInitialized(chatSDK);
  }

  if (SendbirdUIKit.VERSION) {
    chatSDK.addExtension('sb_uikit', SendbirdUIKit.VERSION);
  }

  if (SendbirdUIKit.PLATFORM) {
    chatSDK.addExtension('device-os-platform', SendbirdUIKit.PLATFORM);
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
    chatSDK.setOnlineListener?.((onOnline) => listener(onOnline, 'online'));
    chatSDK.setOfflineListener?.((onOffline) => listener(onOffline, 'offline'));
  }
  return { chatSDK, unsubscribes };
};

export default SendbirdUIKitContainer;
