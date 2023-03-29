import { useMemo } from 'react';

import ImageCompressionConfig, { ImageCompressionConfigInterface } from '../../libs/ImageCompressionConfig';

export const useImageCompressionConfig = (props?: Partial<ImageCompressionConfigInterface>) => {
  return useMemo(() => {
    return new ImageCompressionConfig({
      compressionRate: props?.compressionRate || ImageCompressionConfig.DEFAULT.COMPRESSION_RATE,
      width: props?.width,
      height: props?.height,
    });
  }, [props?.compressionRate, props?.width, props?.height]);
};
