import React from 'react';

import { getDownscaleSize, getFileExtension, hash } from '@sendbird/uikit-utils';

import SBUUtils from '../libs/SBUUtils';
import SBUDynamicModule from './dynamicModule';
import type { MediaServiceInterface } from './types';

type Modules = {
  VideoComponent?: unknown;
  thumbnailModule?: unknown;
};

const createNativeMediaService = (_?: Modules): MediaServiceInterface => {
  const Thumbnail = SBUDynamicModule.get('react-native-create-thumbnail');
  const Video = SBUDynamicModule.get('react-native-video');
  const ImageResizer = SBUDynamicModule.get('@bam.tech/react-native-image-resizer');

  return {
    VideoComponent({ source, resizeMode, onLoad, ...props }) {
      return <Video.default {...props} source={source} resizeMode={resizeMode} onLoad={onLoad} controls />;
    },
    async getVideoThumbnail({ url, timeMills }) {
      try {
        const { path } = await Thumbnail.createThumbnail({
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
    async compressImage({ path, maxWidth, maxHeight, compressionRate = 1 }) {
      const originSize = await SBUUtils.getImageSize(path);
      const { width, height } = getDownscaleSize(originSize, { width: maxWidth, height: maxHeight });
      const extension = (() => {
        return { 'png': 'PNG', 'jpeg': 'JPEG', 'jpg': 'JPEG' }[getFileExtension(path)] ?? 'JPEG';
      })() as 'PNG' | 'JPEG';

      const { path: resizedPath, size: resizedSize } = await ImageResizer.default.createResizedImage(
        path,
        width,
        height,
        extension,
        Math.min(Math.max(0, compressionRate), 1) * 100,
      );

      return { path: resizedPath, size: resizedSize };
    },
  };
};

export default createNativeMediaService;
