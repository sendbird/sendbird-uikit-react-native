import type * as ExpoAV from 'expo-av';
import type * as ExpoFS from 'expo-file-system';
import type * as ExpoImageManipulator from 'expo-image-manipulator';
import type { EventSubscription } from 'expo-modules-core';
import type * as ExpoVideo from 'expo-video';
import type { StatusChangeEventPayload } from 'expo-video';
import type * as ExpoVideoThumbnail from 'expo-video-thumbnails';
import React, { useEffect } from 'react';

import { Logger, getDownscaleSize } from '@sendbird/uikit-utils';

import SBUUtils from '../libs/SBUUtils';
import expoBackwardUtils from '../utils/expoBackwardUtils';
import type { ExpoVideoModule } from '../utils/expoBackwardUtils';
import type { MediaServiceInterface, VideoProps } from './types';

type Modules = {
  avModule: ExpoVideoModule;
  thumbnailModule: typeof ExpoVideoThumbnail;
  imageManipulator: typeof ExpoImageManipulator;
  fsModule: typeof ExpoFS;
};

interface VideoModuleAdapter {
  VideoComponent: React.ComponentType<VideoProps>;
}

class LegacyExpoAVVideoAdapter implements VideoModuleAdapter {
  private readonly avModule: typeof ExpoAV;
  constructor(avModule: typeof ExpoAV) {
    this.avModule = avModule;
  }

  VideoComponent = ({ source, resizeMode, onLoad, ...props }: VideoProps) => {
    // FIXME: type error https://github.com/expo/expo/issues/17101
    // @ts-ignore
    return <this.avModule.Video {...props} source={source} resizeMode={resizeMode} onLoad={onLoad} useNativeControls />;
  };
}

class ExpoVideoAdapter implements VideoModuleAdapter {
  constructor(private readonly _videoModule: typeof ExpoVideo) {}

  VideoComponent = ({ source, resizeMode, onLoad, ...props }: VideoProps) => {
    const player = this._videoModule.useVideoPlayer(source);

    useEffect(() => {
      if (onLoad && player) {
        let subscription: EventSubscription | null = null;
        try {
          subscription = player.addListener('statusChange', (eventData: StatusChangeEventPayload) => {
            const { status, error } = eventData;
            if (status === 'readyToPlay' && !error) {
              onLoad();
            }
          });
        } catch (error) {
          const timeout = setTimeout(() => onLoad(), 300);
          return () => clearTimeout(timeout);
        }

        return () => {
          if (subscription) {
            subscription.remove();
          }
        };
      }
      return undefined;
    }, [onLoad, player]);

    const getContentFit = (mode: typeof resizeMode): 'cover' | 'contain' | 'fill' => {
      switch (mode) {
        case 'cover':
          return 'cover';
        case 'contain':
          return 'contain';
        case 'stretch':
          return 'fill';
        default:
          return 'contain';
      }
    };

    return React.createElement(this._videoModule.VideoView, {
      ...props,
      player,
      contentFit: getContentFit(resizeMode),
    });
  };
}

const createExpoMediaService = ({
  avModule,
  thumbnailModule,
  imageManipulator,
  fsModule,
}: Modules): MediaServiceInterface => {
  if (expoBackwardUtils.expoAV.isLegacyAVModule(avModule)) {
    Logger.warn(
      '[MediaService.Expo] expo-av is deprecated and will be removed in Expo 54. Please migrate to expo-video.',
    );
  }

  const videoAdapter = expoBackwardUtils.expoAV.isVideoModule(avModule)
    ? new ExpoVideoAdapter(avModule)
    : new LegacyExpoAVVideoAdapter(avModule as typeof ExpoAV);

  return {
    VideoComponent: videoAdapter.VideoComponent,
    async getVideoThumbnail({ url, quality, timeMills }) {
      try {
        const { uri } = await thumbnailModule.getThumbnailAsync(url, { quality, time: timeMills });
        return { path: uri };
      } catch {
        return null;
      }
    },
    async compressImage({ maxWidth, maxHeight, compressionRate = 1, uri }) {
      const originSize = await SBUUtils.getImageSize(uri);
      const resizingSize = getDownscaleSize(originSize, { width: maxWidth, height: maxHeight });

      const { uri: compressedURI } = await imageManipulator.manipulateAsync(uri, [{ resize: resizingSize }], {
        compress: Math.min(Math.max(0, compressionRate), 1),
      });
      const fileInfo = await fsModule.getInfoAsync(uri);

      return { uri: compressedURI, size: expoBackwardUtils.toFileSize(fileInfo) };
    },
  };
};

export default createExpoMediaService;
