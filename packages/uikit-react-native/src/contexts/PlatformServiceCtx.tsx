import React from 'react';

import type {
  ClipboardServiceInterface,
  FileServiceInterface,
  MediaServiceInterface,
  NotificationServiceInterface,
} from '../platform/types';

type Props = React.PropsWithChildren<{
  fileService: FileServiceInterface;
  clipboardService: ClipboardServiceInterface;
  notificationService: NotificationServiceInterface;
  mediaService: MediaServiceInterface;
}>;

export type PlatformServiceContextType = {
  fileService: FileServiceInterface;
  clipboardService: ClipboardServiceInterface;
  notificationService: NotificationServiceInterface;
  mediaService: MediaServiceInterface;
};

export const PlatformServiceContext = React.createContext<PlatformServiceContextType | null>(null);
export const PlatformServiceProvider = ({
  children,
  fileService,
  clipboardService,
  notificationService,
  mediaService,
}: Props) => {
  return (
    <PlatformServiceContext.Provider value={{ fileService, clipboardService, notificationService, mediaService }}>
      {children}
    </PlatformServiceContext.Provider>
  );
};
