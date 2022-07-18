import React from 'react';

import type { ClipboardServiceInterface, FileServiceInterface, NotificationServiceInterface } from '../platform/types';

type Props = {
  fileService: FileServiceInterface;
  clipboardService: ClipboardServiceInterface;
  notificationService: NotificationServiceInterface;
};

export const PlatformServiceContext = React.createContext<Props | null>(null);
export const PlatformServiceProvider: React.FC<Props> = ({
  children,
  fileService,
  clipboardService,
  notificationService,
}) => {
  return (
    <PlatformServiceContext.Provider value={{ fileService, clipboardService, notificationService }}>
      {children}
    </PlatformServiceContext.Provider>
  );
};
