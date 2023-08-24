import React from 'react';

import type {
  ClipboardServiceInterface,
  FileServiceInterface,
  MediaServiceInterface,
  NotificationServiceInterface,
  PlayerServiceInterface,
  RecorderServiceInterface,
} from '../platform/types';

type Props = React.PropsWithChildren<{
  fileService: FileServiceInterface;
  clipboardService: ClipboardServiceInterface;
  notificationService: NotificationServiceInterface;
  mediaService: MediaServiceInterface;
  recorderService: RecorderServiceInterface;
  playerService: PlayerServiceInterface;
}>;

export type PlatformServiceContextType = {
  fileService: FileServiceInterface;
  clipboardService: ClipboardServiceInterface;
  notificationService: NotificationServiceInterface;
  mediaService: MediaServiceInterface;
  recorderService: RecorderServiceInterface;
  playerService: PlayerServiceInterface;
};

export const PlatformServiceContext = React.createContext<PlatformServiceContextType | null>(null);
export const PlatformServiceProvider = ({ children, ...services }: Props) => {
  return <PlatformServiceContext.Provider value={services}>{children}</PlatformServiceContext.Provider>;
};
