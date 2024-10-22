import React, { useEffect } from 'react';

import { useAppState } from '@sendbird/uikit-utils';

import VoiceMessageConfig from '../libs/VoiceMessageConfig';
import type {
  ClipboardServiceInterface,
  FileServiceInterface,
  MediaServiceInterface,
  NotificationServiceInterface,
  PlayerServiceInterface,
  RecorderServiceInterface,
} from '../platform/types';

export type PlatformServiceContextType = {
  fileService: FileServiceInterface;
  clipboardService: ClipboardServiceInterface;
  notificationService: NotificationServiceInterface;
  mediaService: MediaServiceInterface;
  recorderService: RecorderServiceInterface;
  playerService: PlayerServiceInterface;
};
type Props = React.PropsWithChildren<PlatformServiceContextType & { voiceMessageConfig: VoiceMessageConfig }>;

export const PlatformServiceContext = React.createContext<PlatformServiceContextType | null>(null);
export const PlatformServiceProvider = ({ children, voiceMessageConfig, ...services }: Props) => {
  useEffect(() => {
    services.recorderService.options.minDuration = voiceMessageConfig.recorder.minDuration;
    services.recorderService.options.maxDuration = voiceMessageConfig.recorder.maxDuration;
  }, [voiceMessageConfig]);

  useAppState('change', (state) => {
    if (state !== 'active') {
      services.playerService.reset().catch(() => {});
      services.recorderService.reset().catch(() => {});
    }
  });

  return <PlatformServiceContext.Provider value={services}>{children}</PlatformServiceContext.Provider>;
};
