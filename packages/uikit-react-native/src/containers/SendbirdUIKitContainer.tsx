import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Sendbird, { DeviceOsPlatform, SendbirdPlatform, SendbirdProduct } from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import type { HeaderStyleContextType, UIKitTheme } from '@gathertown/uikit-react-native-foundation';
import {
  DialogProvider,
  Header,
  HeaderStyleProvider,
  LightUIKitTheme,
  ToastProvider,
  UIKitThemeProvider,
} from '@gathertown/uikit-react-native-foundation';
import { SBUConfig, UIKitConfigProvider } from '@sendbird/uikit-tools';
import type {
  PartialDeep,
  SendbirdChatSDK,
  SendbirdEncryption,
  SendbirdGroupChannel,
  SendbirdGroupChannelCreateParams,
  SendbirdMember,
  SendbirdUser,
} from '@gathertown/uikit-utils';
import { NOOP, useIsFirstMount } from '@gathertown/uikit-utils';

import { LocalizationContext, LocalizationProvider } from '../contexts/LocalizationCtx';
import { PlatformServiceProvider } from '../contexts/PlatformServiceCtx';
import { ReactionProvider } from '../contexts/ReactionCtx';
import type { ChatRelatedFeaturesInUIKit } from '../contexts/SendbirdChatCtx';
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
type UnimplementedFeatures = 'enableVoiceMessage' | 'threadReplySelectType' | 'replyType';
export const SendbirdUIKit = Object.freeze({
  VERSION,
  PLATFORM: Platform.OS.toLowerCase(),
  DEFAULT: {
    AUTO_PUSH_TOKEN_REGISTRATION: true,
    USE_USER_ID_FOR_NICKNAME: false,
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
  chatOptions: {
    localCacheStorage: LocalCacheStorage;
    localCacheEncryption?: SendbirdEncryption;
    onInitialized?: (sdkInstance: SendbirdChatSDK) => SendbirdChatSDK;
  } & Partial<ChatRelatedFeaturesInUIKit>;
  uikitOptions?: PartialDeep<{
    common: SBUConfig['common'];
    groupChannel: Omit<SBUConfig['groupChannel']['channel'], UnimplementedFeatures> & {
      replyType: Extract<SBUConfig['groupChannel']['channel']['replyType'], 'none' | 'quote_reply'>;
    };
    groupChannelList: SBUConfig['groupChannel']['channelList'];
    groupChannelSettings: SBUConfig['groupChannel']['setting'];
    openChannel: SBUConfig['openChannel']['channel'];
  }>;
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
    disabled?: boolean;
    onError?: (props: ErrorBoundaryProps) => void;
    ErrorInfoComponent?: (props: ErrorBoundaryProps) => JSX.Element;
  };
  toast?: {
    dismissTimeout?: number;
  };
  userProfile?: {
    onCreateChannel: (channel: SendbirdGroupChannel) => void;
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
  uikitOptions,
  platformServices,
  localization,
  styles,
  errorBoundary,
  toast,
  userProfile,
  userMention,
  imageCompression,
}: SendbirdUIKitContainerProps) => {
  if (!chatOptions.localCacheStorage) {
    throw new Error('SendbirdUIKitContainer: chatOptions.localCacheStorage is required');
  }

  const defaultStringSet = localization?.stringSet ?? StringSetEn;

  const isFirstMount = useIsFirstMount();
  const unsubscribes = useRef<Array<() => void>>([]);

  const [internalStorage] = useState(() => new InternalLocalCacheStorage(chatOptions.localCacheStorage));
  const [sdkInstance, setSdkInstance] = useState<SendbirdChatSDK>(() => {
    const sendbird = initializeSendbird(appId, { internalStorage, ...chatOptions });
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
    return new MentionManager(config);
  }, [userMention?.mentionLimit, userMention?.suggestionLimit, userMention?.debounceMills]);

  const imageCompressionConfig = useMemo(() => {
    return new ImageCompressionConfig({
      compressionRate: imageCompression?.compressionRate || ImageCompressionConfig.DEFAULT.COMPRESSION_RATE,
      width: imageCompression?.width,
      height: imageCompression?.height,
    });
  }, [imageCompression?.compressionRate, imageCompression?.width, imageCompression?.height]);

  useLayoutEffect(() => {
    if (!isFirstMount) {
      const sendbird = initializeSendbird(appId, { internalStorage, ...chatOptions });
      setSdkInstance(sendbird.chatSDK);
      unsubscribes.current = sendbird.unsubscribes;
    }

    return () => {
      unsubscribes.current.forEach((u) => {
        try {
          u();
        } catch {}
      });
    };
  }, [appId, internalStorage]);

  const renderChildren = () => {
    if (errorBoundary?.disabled) {
      return children;
    } else {
      return <InternalErrorBoundaryContainer {...errorBoundary}>{children}</InternalErrorBoundaryContainer>;
    }
  };

  return (
    <SafeAreaProvider>
      <UIKitConfigProvider
        storage={internalStorage}
        localConfigs={{
          common: uikitOptions?.common,
          groupChannel: {
            channel: uikitOptions?.groupChannel,
            channelList: uikitOptions?.groupChannelList,
            setting: uikitOptions?.groupChannelSettings,
          },
          openChannel: {
            channel: uikitOptions?.openChannel,
          },
        }}
      >
        <SendbirdChatProvider
          sdkInstance={sdkInstance}
          emojiManager={emojiManager}
          mentionManager={mentionManager}
          imageCompressionConfig={imageCompressionConfig}
          enableAutoPushTokenRegistration={
            chatOptions.enableAutoPushTokenRegistration ?? SendbirdUIKit.DEFAULT.AUTO_PUSH_TOKEN_REGISTRATION
          }
          enableUseUserIdForNickname={
            chatOptions.enableUseUserIdForNickname ?? SendbirdUIKit.DEFAULT.USE_USER_ID_FOR_NICKNAME
          }
          enableImageCompression={chatOptions.enableImageCompression ?? SendbirdUIKit.DEFAULT.IMAGE_COMPRESSION}
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
                      statusBarTranslucent={styles?.statusBarTranslucent ?? true}
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
                                {renderChildren()}
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
      </UIKitConfigProvider>
    </SafeAreaProvider>
  );
};

const initializeSendbird = (
  appId: string,
  options: {
    internalStorage?: InternalLocalCacheStorage;
    onInitialized?: (sdk: SendbirdChatSDK) => SendbirdChatSDK;
    localCacheEncryption?: SendbirdEncryption;
  },
) => {
  let chatSDK: SendbirdChatSDK;
  const unsubscribes: Array<() => void> = [];
  const { internalStorage, localCacheEncryption, onInitialized } = options;

  chatSDK = Sendbird.init({
    appId,
    newInstance: true,
    modules: [new GroupChannelModule(), new OpenChannelModule()],
    localCacheEnabled: Boolean(internalStorage),
    useAsyncStorageStore: internalStorage as never,
    localCacheEncryption,
  });

  if (onInitialized) {
    chatSDK = onInitialized(chatSDK);
  }

  const platform = getDeviceOSPlatform();
  if (SendbirdUIKit.VERSION && platform) {
    const deviceOSInfo = { platform, version: String(Platform.Version) };
    const customData = { platform_version: getReactNativeVersion() };
    const uikitExtension = {
      product: SendbirdProduct.UIKIT_CHAT,
      version: SendbirdUIKit.VERSION,
      platform: SendbirdPlatform.REACT_NATIVE,
    };

    chatSDK.addSendbirdExtensions([uikitExtension], deviceOSInfo, customData);
    chatSDK.addExtension('sb_uikit', SendbirdUIKit.VERSION);
  }

  if (SendbirdUIKit.PLATFORM) {
    chatSDK.addExtension('device-os-platform', SendbirdUIKit.PLATFORM);
  }

  if (NetInfo?.addEventListener) {
    try {
      // NOTE: For removing buggy behavior of NetInfo.addEventListener
      //  When you first add an event listener, it is assumed that the initialization of the internal event detector is done simultaneously.
      //  In other words, when you call the first event listener two events are triggered immediately
      //   - the one that is called when adding the event listener
      //   - and the internal initialization event
      NetInfo.addEventListener(NOOP)();
    } catch {}

    const listener = (callback: () => void, callbackType: 'online' | 'offline') => {
      let callCount = 0;
      const unsubscribe = NetInfo.addEventListener((state) => {
        const online = Boolean(state.isConnected) || Boolean(state.isInternetReachable);

        // NOTE: When NetInfo.addEventListener is called
        //  the event is immediately triggered regardless of whether the event actually occurred.
        //  This is why it filters the first event.
        if (callCount === 0) {
          callCount++;
          return;
        }

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

function getDeviceOSPlatform() {
  switch (Platform.OS) {
    case 'android':
      return DeviceOsPlatform.ANDROID;
    case 'ios':
      return DeviceOsPlatform.IOS;
    case 'web':
      return DeviceOsPlatform.WEB;
    case 'windows':
      return DeviceOsPlatform.WINDOWS;
    default:
      return undefined;
  }
}

function getReactNativeVersion() {
  const { major, minor, patch } = Platform.constants.reactNativeVersion;
  return `${major}.${minor}.${patch}`;
}

export default SendbirdUIKitContainer;
