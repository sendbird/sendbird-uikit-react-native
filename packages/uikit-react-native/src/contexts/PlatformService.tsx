import React, { useContext } from 'react';

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
export const usePlatformService = () => {
  const value = useContext(PlatformServiceContext);
  if (!value) throw new Error('PlatformServiceContext is not provided');
  return value;
};
