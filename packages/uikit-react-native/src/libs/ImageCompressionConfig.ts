export interface ImageCompressionConfigInterface {
  compressionRate: number;
  width?: number;
  height?: number;
}

class ImageCompressionConfig {
  static DEFAULT = {
    COMPRESSION_RATE: 0.7,
  };

  constructor(private _config: ImageCompressionConfigInterface) {}

  get compressionRate() {
    return this._config.compressionRate;
  }

  get width() {
    return this._config.width;
  }

  get height() {
    return this._config.height;
  }
}

export default ImageCompressionConfig;
