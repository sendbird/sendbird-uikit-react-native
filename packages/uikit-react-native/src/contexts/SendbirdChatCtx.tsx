import React, { useCallback, useEffect, useState } from 'react';

import { useAppFeatures } from '@sendbird/uikit-chat-hooks';
import { SBUConfig, useUIKitConfig } from '@sendbird/uikit-tools';
import type {
  SendbirdChatSDK,
  SendbirdGroupChannel,
  SendbirdUser,
  SendbirdUserUpdateParams,
} from '@sendbird/uikit-utils';
import { confirmAndMarkAsDelivered, useAppState, useForceUpdate } from '@sendbird/uikit-utils';

import type EmojiManager from '../libs/EmojiManager';
import type ImageCompressionConfig from '../libs/ImageCompressionConfig';
import type MentionManager from '../libs/MentionManager';
import type VoiceMessageConfig from '../libs/VoiceMessageConfig';
import VoiceMessageStatusManager from '../libs/VoiceMessageStatusManager';
import type { FileType } from '../platform/types';
import pubsub, { type PubSub } from '../utils/pubsub';

export interface ChatRelatedFeaturesInUIKit {
  enableAutoPushTokenRegistration: boolean;
  enableUseUserIdForNickname: boolean;
  enableImageCompression: boolean;
}

interface Props extends ChatRelatedFeaturesInUIKit, React.PropsWithChildren {
  sdkInstance: SendbirdChatSDK;

  emojiManager: EmojiManager;
  mentionManager: MentionManager;
  voiceMessageStatusManager: VoiceMessageStatusManager;
  imageCompressionConfig: ImageCompressionConfig;
  voiceMessageConfig: VoiceMessageConfig;
}

export type GroupChannelFragmentOptionsPubSubContextPayload = {
  type: 'OVERRIDE_SEARCH_ITEM_STARTING_POINT';
  data: {
    startingPoint: number;
  };
};

export type SendbirdChatContextType = {
  sdk: SendbirdChatSDK;
  currentUser?: SendbirdUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<SendbirdUser | undefined>>;

  // feature related instances
  emojiManager: EmojiManager;
  mentionManager: MentionManager;
  voiceMessageStatusManager: VoiceMessageStatusManager;
  imageCompressionConfig: ImageCompressionConfig;
  voiceMessageConfig: VoiceMessageConfig;

  // helper functions
  updateCurrentUserInfo: (nickname?: string, profile?: string | FileType) => Promise<SendbirdUser>;
  markAsDeliveredWithChannel: (channel: SendbirdGroupChannel) => void;

  groupChannelFragmentOptions: {
    pubsub: PubSub<GroupChannelFragmentOptionsPubSubContextPayload>;
  };
  sbOptions: {
    // UIKit options
    uikit: SBUConfig;
    uikitWithAppInfo: {
      groupChannel: {
        channel: {
          readonly enableReactions: boolean;
          readonly enableReactionsSupergroup: boolean;
          readonly enableOgtag: boolean;
        };
        setting: {
          readonly enableMessageSearch: boolean;
        };
      };
      openChannel: {
        channel: {
          readonly enableOgtag: boolean;
        };
      };
    };

    // Chat related options in UIKit
    chat: {
      imageCompressionEnabled: boolean;
      useUserIdForNicknameEnabled: boolean;
      autoPushTokenRegistrationEnabled: boolean; // RN only
    };

    // Sendbird application options
    appInfo: {
      deliveryReceiptEnabled: boolean;
      broadcastChannelEnabled: boolean;
      superGroupChannelEnabled: boolean;
      reactionEnabled: boolean;
      uploadSizeLimit: number | undefined;
    };
  };
};

export const SendbirdChatContext = React.createContext<SendbirdChatContextType | null>(null);
export const SendbirdChatProvider = ({
  children,
  sdkInstance,
  emojiManager,
  mentionManager,
  voiceMessageStatusManager,
  imageCompressionConfig,
  voiceMessageConfig,
  enableAutoPushTokenRegistration,
  enableUseUserIdForNickname,
  enableImageCompression,
}: Props) => {
  const [currentUser, _setCurrentUser] = useState<SendbirdUser>();
  const forceUpdate = useForceUpdate();
  const appFeatures = useAppFeatures(sdkInstance);
  const { configs, configsWithAppAttr } = useUIKitConfig();

  const setCurrentUser: SendbirdChatContextType['setCurrentUser'] = useCallback((user) => {
    // NOTE: Sendbird SDK handle User object is always same object, so force update after setCurrentUser
    _setCurrentUser(user);
    forceUpdate();
  }, []);

  const updateCurrentUserInfo: SendbirdChatContextType['updateCurrentUserInfo'] = useCallback(
    async (nickname, profile) => {
      let user = currentUser;

      if (!user) throw new Error('Current user is not defined, please connect using `useConnection()` hook first');

      const params: SendbirdUserUpdateParams = {};

      if (!nickname) {
        params.nickname = user.nickname;
      } else {
        params.nickname = nickname;
      }

      if (!profile) {
        params.profileUrl = user.profileUrl;
      } else if (typeof profile === 'string') {
        params.profileUrl = profile;
      } else if (typeof profile === 'object') {
        params.profileImage = profile;
      } else {
        throw new Error(`Cannot update profile, not supported profile type(${typeof profile})`);
      }

      user = await sdkInstance.updateCurrentUserInfo(params);

      setCurrentUser(user);
      return user;
    },
    [sdkInstance, currentUser, setCurrentUser],
  );

  const markAsDeliveredWithChannel: SendbirdChatContextType['markAsDeliveredWithChannel'] = useCallback(
    (channel: SendbirdGroupChannel) => {
      if (appFeatures.deliveryReceiptEnabled) confirmAndMarkAsDelivered([channel]);
    },
    [sdkInstance, appFeatures.deliveryReceiptEnabled],
  );

  useAppState('change', (status) => {
    // 'active' | 'background' | 'inactive' | 'unknown' | 'extension';
    if (status === 'active') sdkInstance.connectionState === 'CLOSED' && sdkInstance.setForegroundState();
    else if (status === 'background') sdkInstance.connectionState === 'OPEN' && sdkInstance.setBackgroundState();
  });

  useEffect(() => {
    return () => {
      sdkInstance.disconnect().then(() => _setCurrentUser(undefined));
    };
  }, [sdkInstance]);

  const value: SendbirdChatContextType = {
    sdk: sdkInstance,
    emojiManager,
    mentionManager,
    imageCompressionConfig,
    voiceMessageConfig,
    voiceMessageStatusManager,
    currentUser,
    setCurrentUser,

    updateCurrentUserInfo,
    markAsDeliveredWithChannel,
    groupChannelFragmentOptions: {
      pubsub: pubsub<GroupChannelFragmentOptionsPubSubContextPayload>(),
    },

    // TODO: Options should be moved to the common area at the higher level to be passed to the context of each product.
    //  For example, common -> chat context, common -> calls context
    sbOptions: {
      appInfo: appFeatures,
      uikit: configs,
      uikitWithAppInfo: configsWithAppAttr(sdkInstance),
      chat: {
        autoPushTokenRegistrationEnabled: enableAutoPushTokenRegistration,
        useUserIdForNicknameEnabled: enableUseUserIdForNickname,
        imageCompressionEnabled: enableImageCompression,
      },
    },
  };

  return <SendbirdChatContext.Provider value={value}>{children}</SendbirdChatContext.Provider>;
};
