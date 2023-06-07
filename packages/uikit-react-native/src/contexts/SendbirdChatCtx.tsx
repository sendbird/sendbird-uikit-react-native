import React, { useCallback, useState } from 'react';

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
import type { FileType } from '../platform/types';

export interface ChatRelatedFeaturesInUIKit {
  enableAutoPushTokenRegistration: boolean;
  enableUseUserIdForNickname: boolean;
  enableImageCompression: boolean;
}

interface Props extends ChatRelatedFeaturesInUIKit, React.PropsWithChildren {
  sdkInstance: SendbirdChatSDK;
  emojiManager: EmojiManager;
  mentionManager: MentionManager;
  imageCompressionConfig: ImageCompressionConfig;
}

export type SendbirdChatContextType = {
  sdk: SendbirdChatSDK;
  emojiManager: EmojiManager;
  mentionManager: MentionManager;
  imageCompressionConfig: ImageCompressionConfig;
  currentUser?: SendbirdUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<SendbirdUser | undefined>>;

  // helper functions
  updateCurrentUserInfo: (nickname?: string, profile?: string | FileType) => Promise<SendbirdUser>;
  markAsDeliveredWithChannel: (channel: SendbirdGroupChannel) => void;

  sbOptions: {
    // UIKit options
    uikit: SBUConfig;

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
    };
  };
};

export const SendbirdChatContext = React.createContext<SendbirdChatContextType | null>(null);
export const SendbirdChatProvider = ({
  children,
  sdkInstance,
  emojiManager,
  mentionManager,
  imageCompressionConfig,
  enableAutoPushTokenRegistration,
  enableUseUserIdForNickname,
  enableImageCompression,
}: Props) => {
  const [currentUser, _setCurrentUser] = useState<SendbirdUser>();
  const forceUpdate = useForceUpdate();
  const appFeatures = useAppFeatures(sdkInstance);
  const { configs } = useUIKitConfig();

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

  const value: SendbirdChatContextType = {
    sdk: sdkInstance,
    emojiManager,
    mentionManager,
    imageCompressionConfig,
    currentUser,
    setCurrentUser,

    updateCurrentUserInfo,
    markAsDeliveredWithChannel,

    // TODO: Options should be moved to the common area at the higher level to be passed to the context of each product.
    //  For example, common -> chat context, common -> calls context
    sbOptions: {
      appInfo: appFeatures,
      uikit: configs,
      chat: {
        autoPushTokenRegistrationEnabled: enableAutoPushTokenRegistration,
        useUserIdForNicknameEnabled: enableUseUserIdForNickname,
        imageCompressionEnabled: enableImageCompression,
      },
    },
  };

  return <SendbirdChatContext.Provider value={value}>{children}</SendbirdChatContext.Provider>;
};
