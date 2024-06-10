import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SendbirdChat, { DeviceOsPlatform, SendbirdChatParams, SendbirdPlatform, SendbirdProduct } from '@sendbird/chat';
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
import { SBUConfig, UIKitConfigProvider } from '@sendbird/uikit-tools';
import type {
  PartialDeep,
  SendbirdChatSDK,
  SendbirdGroupChannel,
  SendbirdGroupChannelCreateParams,
  SendbirdMember,
  SendbirdUser,
} from '@sendbird/uikit-utils';
import { NOOP, useIsFirstMount } from '@sendbird/uikit-utils';

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
import VoiceMessageConfig, { VoiceMessageConfigInterface } from '../libs/VoiceMessageConfig';
import StringSetEn from '../localization/StringSet.en';
import type { StringSet } from '../localization/StringSet.type';
import SBUDynamicModule from '../platform/dynamicModule';
import type {
  ClipboardServiceInterface,
  FileServiceInterface,
  MediaServiceInterface,
  NotificationServiceInterface,
  PlayerServiceInterface,
  RecorderServiceInterface,
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
    USE_USER_ID_FOR_NICKNAME: false,
    IMAGE_COMPRESSION: true,
  },
});

type UnimplementedFeatures = 'threadReplySelectType' | 'replyType' | 'enableReactionsSupergroup';
export type ChatOmittedInitParams = Omit<
  SendbirdChatParams<[GroupChannelModule, OpenChannelModule]>,
  (typeof chatOmitKeys)[number]
>;

const chatOmitKeys = [
  'appId',
  'newInstance',
  'modules',
  'debugMode',
  'appVersion',
  'localCacheEnabled',
  'useAsyncStorageStore',
] as const;
function sanitizeChatOptions<T extends Record<string, unknown>>(chatOptions: T): T {
  const opts = { ...chatOptions };
  chatOmitKeys.forEach((key) => delete opts[key]);
  return opts;
}

export type SendbirdUIKitContainerProps = React.PropsWithChildren<{
  appId: string;
  platformServices: {
    file: FileServiceInterface;
    notification: NotificationServiceInterface;
    clipboard: ClipboardServiceInterface;
    media: MediaServiceInterface;
    player: PlayerServiceInterface;
    recorder: RecorderServiceInterface;
  };
  chatOptions: {
    localCacheStorage: LocalCacheStorage;
    onInitialized?: (sdkInstance: SendbirdChatSDK) => SendbirdChatSDK;
  } & Partial<ChatOmittedInitParams> &
    Partial<ChatRelatedFeaturesInUIKit>;
  uikitOptions?: PartialDeep<{
    common: SBUConfig['common'];
    groupChannel: Omit<SBUConfig['groupChannel']['channel'], UnimplementedFeatures> & {
      replyType: Extract<SBUConfig['groupChannel']['channel']['replyType'], 'none' | 'quote_reply'>;
      /**
       * @deprecated Currently, this feature is turned off by default. If you wish to use this feature, contact us: {@link https://dashboard.sendbird.com/settings/contact_us?category=feedback_and_feature_requests&product=UIKit}
       */
      enableReactionsSupergroup: never;
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
    ErrorInfoComponent?: (props: ErrorBoundaryProps) => React.ReactNode;
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
  reaction?: {
    onPressUserProfile?: (user: SendbirdUser | SendbirdMember) => void;
  };
  userMention?: Pick<Partial<MentionConfigInterface>, 'mentionLimit' | 'suggestionLimit' | 'debounceMills'>;
  imageCompression?: Partial<ImageCompressionConfigInterface>;
  voiceMessage?: PartialDeep<VoiceMessageConfigInterface>;
}>;

const SendbirdUIKitContainer = (props: SendbirdUIKitContainerProps) => {
  const {
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
    reaction,
  } = props;

  if (!chatOptions.localCacheStorage) {
    throw new Error('SendbirdUIKitContainer: chatOptions.localCacheStorage is required');
  }

  const defaultStringSet = localization?.stringSet ?? StringSetEn;

  const isFirstMount = useIsFirstMount();
  const unsubscribes = useRef<Array<() => void>>([]);

  const [internalStorage] = useState(() => new InternalLocalCacheStorage(chatOptions.localCacheStorage));
  const [sdkInstance, setSdkInstance] = useState<SendbirdChatSDK>(() => {
    const sendbird = initializeSendbird(appId, { internalStorage, ...sanitizeChatOptions(chatOptions) });
    unsubscribes.current = sendbird.unsubscribes;
    return sendbird.chatSDK;
  });

  const { imageCompressionConfig, voiceMessageConfig, mentionConfig } = useConfigInstance(props);
  const emojiManager = useMemo(() => new EmojiManager(internalStorage), [internalStorage]);
  const mentionManager = useMemo(() => new MentionManager(mentionConfig), [mentionConfig]);

  useLayoutEffect(() => {
    if (!isFirstMount) {
      const sendbird = initializeSendbird(appId, { internalStorage, ...sanitizeChatOptions(chatOptions) });
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
            channel: { ...uikitOptions?.groupChannel, enableReactionsSupergroup: undefined },
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
          voiceMessageConfig={voiceMessageConfig}
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
              playerService={platformServices.player}
              recorderService={platformServices.recorder}
              voiceMessageConfig={voiceMessageConfig}
            >
              <UIKitThemeProvider theme={styles?.theme ?? LightUIKitTheme}>
                <HeaderStyleProvider
                  HeaderComponent={styles?.HeaderComponent ?? Header}
                  defaultTitleAlign={styles?.defaultHeaderTitleAlign ?? 'left'}
                  statusBarTranslucent={styles?.statusBarTranslucent ?? true}
                >
                  <ToastProvider dismissTimeout={toast?.dismissTimeout}>
                    <UserProfileProvider {...userProfile} statusBarTranslucent={styles?.statusBarTranslucent ?? true}>
                      <ReactionProvider {...reaction}>
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

interface InitOptions extends ChatOmittedInitParams {
  internalStorage: InternalLocalCacheStorage;
  onInitialized?: (sdk: SendbirdChatSDK) => SendbirdChatSDK;
}
const initializeSendbird = (appId: string, options: InitOptions) => {
  let chatSDK: SendbirdChatSDK;
  const unsubscribes: Array<() => void> = [];
  const { internalStorage, onInitialized, ...chatInitParams } = options;

  chatSDK = SendbirdChat.init({
    ...chatInitParams,
    appId,
    newInstance: true,
    modules: [new GroupChannelModule(), new OpenChannelModule()],
    localCacheEnabled: true,
    useAsyncStorageStore: internalStorage as never,
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

const useConfigInstance = ({ imageCompression, userMention, voiceMessage }: SendbirdUIKitContainerProps) => {
  const mentionConfig = useMemo(() => {
    return new MentionConfig({
      mentionLimit: userMention?.mentionLimit || MentionConfig.DEFAULT.MENTION_LIMIT,
      suggestionLimit: userMention?.suggestionLimit || MentionConfig.DEFAULT.SUGGESTION_LIMIT,
      debounceMills: userMention?.debounceMills ?? MentionConfig.DEFAULT.DEBOUNCE_MILLS,
      delimiter: MentionConfig.DEFAULT.DELIMITER,
      trigger: MentionConfig.DEFAULT.TRIGGER,
    });
  }, [userMention?.mentionLimit, userMention?.suggestionLimit, userMention?.debounceMills]);

  const imageCompressionConfig = useMemo(() => {
    return new ImageCompressionConfig({
      compressionRate: imageCompression?.compressionRate || ImageCompressionConfig.DEFAULT.COMPRESSION_RATE,
      width: imageCompression?.width,
      height: imageCompression?.height,
    });
  }, [imageCompression?.compressionRate, imageCompression?.width, imageCompression?.height]);

  const voiceMessageConfig = useMemo(() => {
    return new VoiceMessageConfig({
      recorder: {
        minDuration: voiceMessage?.recorder?.minDuration ?? VoiceMessageConfig.DEFAULT.RECORDER.MIN_DURATION,
        maxDuration: voiceMessage?.recorder?.maxDuration ?? VoiceMessageConfig.DEFAULT.RECORDER.MAX_DURATION,
      },
    });
  }, [voiceMessage?.recorder?.minDuration, voiceMessage?.recorder?.maxDuration]);

  return {
    mentionConfig,
    imageCompressionConfig,
    voiceMessageConfig,
  };
};

export default SendbirdUIKitContainer;
