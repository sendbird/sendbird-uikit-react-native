import React from 'react';

import {
  LanguageEn,
  LanguageProvider,
  PlatformServiceProvider,
  SendbirdChatProvider,
} from '@sendbird/uikit-react-native-core';
import type { FilePickerServiceInterface, NotificationServiceInterface } from '@sendbird/uikit-react-native-core';

import LightUIKitTheme from './theme/LightUIKitTheme';
import UIKitThemeProvider from './theme/UIKitThemeProvider';
import type { UIKitTheme } from './types';

type Props = {
  userId: string | null;
  appId: string;
  localCacheEnabled?: boolean;
  theme?: UIKitTheme;
  services: {
    filePicker: FilePickerServiceInterface;
    notification: NotificationServiceInterface;
  };
};

const SendbirdUIKitContainer: React.FC<Props> = ({
  appId,
  localCacheEnabled,
  userId,
  theme = LightUIKitTheme,
  services,
  children,
}) => {
  return (
    <UIKitThemeProvider theme={theme}>
      <LanguageProvider defaultLocale={'en'} languageSet={{ en: LanguageEn }}>
        <SendbirdChatProvider userId={userId} appId={appId} localCacheEnabled={localCacheEnabled}>
          <PlatformServiceProvider filePickerService={services.filePicker} notificationService={services.notification}>
            {children}
          </PlatformServiceProvider>
        </SendbirdChatProvider>
      </LanguageProvider>
    </UIKitThemeProvider>
  );
};

export default SendbirdUIKitContainer;
