import React from 'react';

import type { ClipboardServiceInterface, FileServiceInterface, NotificationServiceInterface } from '../platform/types';

type Props = React.PropsWithChildren<{
  fileService: FileServiceInterface;
  clipboardService: ClipboardServiceInterface;
  notificationService: NotificationServiceInterface;
}>;

export const PlatformServiceContext = React.createContext<Props | null>(null);
export const PlatformServiceProvider = ({ children, fileService, clipboardService, notificationService }: Props) => {
  return (
    <PlatformServiceContext.Provider value={{ fileService, clipboardService, notificationService }}>
      {children}
    </PlatformServiceContext.Provider>
  );
};
