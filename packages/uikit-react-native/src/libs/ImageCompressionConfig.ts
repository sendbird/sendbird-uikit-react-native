import { Logger } from '@sendbird/uikit-utils';

export interface ImageCompressionConfigInterface {
  compressionRate: number;
  width?: number;
  height?: number;
}

class ImageCompressionConfig {
  static DEFAULT = {
    COMPRESSION_RATE: 0.7,
  };

  constructor(private _config: ImageCompressionConfigInterface) {
    if (_config.compressionRate > 1) Logger.warn('Compression rate must be in the range of 0.0 - 1.0');
  }

  get compressionRate() {
    return Math.min(Math.max(0, this._config.compressionRate), 1);
  }

  get width() {
    return this._config.width;
  }

  get height() {
    return this._config.height;
  }
}

export default ImageCompressionConfig;
