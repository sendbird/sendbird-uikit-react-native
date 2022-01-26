import React, { useContext } from 'react';

import type { FilePickerServiceInterface, NotificationServiceInterface } from '../platform/types';

type Props = {
  notificationService: NotificationServiceInterface;
  filePickerService: FilePickerServiceInterface;
};

export const PlatformServiceContext = React.createContext<Props | null>(null);
export const PlatformServiceProvider: React.FC<Props> = ({ children, notificationService, filePickerService }) => {
  return (
    <PlatformServiceContext.Provider value={{ notificationService, filePickerService }}>
      {children}
    </PlatformServiceContext.Provider>
  );
};
export const usePlatformService = () => {
  const value = useContext(PlatformServiceContext);
  if (!value) throw new Error('PlatformServiceContext is not provided');
  return value;
};
