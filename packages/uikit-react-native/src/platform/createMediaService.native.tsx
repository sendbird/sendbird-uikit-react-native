import type * as RNImageResizer from '@bam.tech/react-native-image-resizer';
import React from 'react';
import type * as RNCreateThumbnail from 'react-native-create-thumbnail';
import type RNVideo from 'react-native-video';

import { getDownscaleSize, getFileExtension, hash } from '@sendbird/uikit-utils';

import SBUUtils from '../libs/SBUUtils';
import type { MediaServiceInterface } from './types';

type Modules = {
  VideoComponent: typeof RNVideo;
  thumbnailModule: typeof RNCreateThumbnail;
  imageResizerModule: typeof RNImageResizer;
};

const createNativeMediaService = ({
  VideoComponent,
  thumbnailModule,
  imageResizerModule,
}: Modules): MediaServiceInterface => {
  return {
    VideoComponent({ source, resizeMode, onLoad, ...props }) {
      return <VideoComponent {...props} source={source} resizeMode={resizeMode} onLoad={onLoad} controls />;
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
    async compressImage({ uri, maxWidth, maxHeight, compressionRate = 1 }) {
      const originSize = await SBUUtils.getImageSize(uri);
      const { width, height } = getDownscaleSize(originSize, { width: maxWidth, height: maxHeight });
      const extension = (() => {
        return { 'png': 'PNG', 'jpeg': 'JPEG', 'jpg': 'JPEG' }[getFileExtension(uri)] ?? 'JPEG';
      })() as 'PNG' | 'JPEG';

      const { size: resizedSize, uri: compressedURI } = await imageResizerModule.default.createResizedImage(
        uri,
        width,
        height,
        extension,
        Math.min(Math.max(0, compressionRate), 1) * 100,
      );

      return { uri: compressedURI, size: resizedSize };
    },
  };
};

export default createNativeMediaService;
