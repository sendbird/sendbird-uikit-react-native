import React from 'react';

import {
  FilePickerServiceInterface,
  NotificationServiceInterface,
  PlatformServiceProvider,
  SendbirdChatProvider,
} from '@sendbird/uikit-react-native-core';

import { LightUIKitTheme, UIKitTheme, UIKitThemeProvider } from './index';

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
    <UIKitThemeProvider value={theme}>
      <SendbirdChatProvider userId={userId} appId={appId} localCacheEnabled={localCacheEnabled}>
        <PlatformServiceProvider filePickerService={services.filePicker} notificationService={services.notification}>
          {children}
        </PlatformServiceProvider>
      </SendbirdChatProvider>
    </UIKitThemeProvider>
  );
};

export default SendbirdUIKitContainer;
