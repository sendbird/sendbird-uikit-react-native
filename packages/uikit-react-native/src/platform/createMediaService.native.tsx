import React from 'react';
import type * as CreateThumbnail from 'react-native-create-thumbnail';
import type Video from 'react-native-video';

import type { MediaServiceInterface } from './types';

type Modules = {
  VideoComponent: typeof Video;
  thumbnailModule: typeof CreateThumbnail;
};

function hash(str: string) {
  return String(Math.abs(str.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)));
}

const createNativeMediaService = ({ VideoComponent, thumbnailModule }: Modules): MediaServiceInterface => {
  return {
    VideoComponent({ source, resizeMode, ...props }) {
      return <VideoComponent {...props} source={source} resizeMode={resizeMode} controls />;
    },
    async getVideoThumbnail({ url, timeMills }) {
      try {
        const { path } = await thumbnailModule.createThumbnail({
          url,
          format: 'jpeg',
          timeStamp: timeMills,
          cacheName: hash(url),
        });
        return { path };
      } catch {
        return null;
      }
    },
  };
};

export default createNativeMediaService;
