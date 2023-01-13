import type * as ExpoAV from 'expo-av';
import type * as ExpoFS from 'expo-file-system';
import type * as ExpoImageManipulator from 'expo-image-manipulator';
import type * as ExpoVideoThumbnail from 'expo-video-thumbnails';
import React from 'react';

import { getDownscaleSize } from '@sendbird/uikit-utils';

import SBUUtils from '../libs/SBUUtils';
import type { MediaServiceInterface } from './types';

type Modules = {
  avModule: typeof ExpoAV;
  thumbnailModule: typeof ExpoVideoThumbnail;
  imageManipulator: typeof ExpoImageManipulator;
  fsModule: typeof ExpoFS;
};

const createExpoMediaService = ({
  avModule,
  thumbnailModule,
  imageManipulator,
  fsModule,
}: Modules): MediaServiceInterface => {
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
    async compressImage({ maxWidth, maxHeight, compressionRate = 1, uri }) {
      const originSize = await SBUUtils.getImageSize(uri);
      const resizingSize = getDownscaleSize(originSize, { width: maxWidth, height: maxHeight });

      const { uri: compressedURI } = await imageManipulator.manipulateAsync(uri, [{ resize: resizingSize }], {
        compress: Math.min(Math.max(0, compressionRate), 1),
      });
      const { size = 0 } = await fsModule.getInfoAsync(uri);

      return { uri: compressedURI, size };
    },
  };
};

export default createExpoMediaService;
