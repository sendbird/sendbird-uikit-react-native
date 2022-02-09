import React from 'react';

import type {
  FilePickerServiceInterface,
  LabelLocale,
  LabelSet,
  NotificationServiceInterface,
} from '@sendbird/uikit-react-native-core';
import {
  LabelEn,
  LocalizationProvider,
  PlatformServiceProvider,
  SendbirdChatProvider,
} from '@sendbird/uikit-react-native-core';

import LightUIKitTheme from './theme/LightUIKitTheme';
import UIKitThemeProvider from './theme/UIKitThemeProvider';
import type { UIKitTheme } from './types';

type Props<T extends string = LabelLocale> = {
  userId: string | null;
  appId: string;
  localCacheEnabled?: boolean;
  services: {
    filePicker: FilePickerServiceInterface;
    notification: NotificationServiceInterface;
  };
  theme?: UIKitTheme;
  localization?: {
    defaultLocale?: T;
    labelSet?: Record<T, LabelSet>;
  };
};

const SendbirdUIKitContainer: React.FC<Props> = ({
  appId,
  localCacheEnabled,
  userId,
  theme,
  services,
  localization,
  children,
}) => {
  return (
    <UIKitThemeProvider theme={theme ?? LightUIKitTheme}>
      <LocalizationProvider
        defaultLocale={localization?.defaultLocale ?? 'en'}
        labelSet={localization?.labelSet ?? { en: LabelEn }}
      >
        <SendbirdChatProvider userId={userId} appId={appId} localCacheEnabled={localCacheEnabled}>
          <PlatformServiceProvider filePickerService={services.filePicker} notificationService={services.notification}>
            {children}
          </PlatformServiceProvider>
        </SendbirdChatProvider>
      </LocalizationProvider>
    </UIKitThemeProvider>
  );
};

export default SendbirdUIKitContainer;
