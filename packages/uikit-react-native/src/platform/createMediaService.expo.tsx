import type * as ExpoAV from 'expo-av';
import type * as ExpoVideoThumbnail from 'expo-video-thumbnails';
import React from 'react';

import type { MediaServiceInterface } from './types';

type Modules = {
  avModule: typeof ExpoAV;
  thumbnailModule: typeof ExpoVideoThumbnail;
};

const createExpoMediaService = ({ avModule, thumbnailModule }: Modules): MediaServiceInterface => {
  return {
    VideoComponent({ source, resizeMode, onLoad, ...props }) {
      // FIXME: type error https://github.com/expo/expo/issues/17101
      // @ts-ignore
      return <avModule.Video {...props} source={source} resizeMode={resizeMode} onLoad={onLoad} useNativeControls />;
    },
    async getVideoThumbnail({ url, quality, timeMills }) {
      try {
        const { uri } = await thumbnailModule.getThumbnailAsync(url, { quality, time: timeMills });
        return { path: uri };
      } catch {
        return null;
      }
    },
  };
};

export default createExpoMediaService;
