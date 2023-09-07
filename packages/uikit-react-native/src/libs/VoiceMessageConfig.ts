export interface VoiceMessageConfigInterface {
  recorder: {
    minDuration: number;
    maxDuration: number;
  };
}

class VoiceMessageConfig {
  static DEFAULT = {
    RECORDER: {
      MIN_DURATION: 1000,
      MAX_DURATION: 600 * 1000,
      EXTENSION: 'm4a',

      BIT_RATE: 12000,
      SAMPLE_RATE: 11025,
      CHANNELS: 1,
    },
  };

  constructor(private _config: VoiceMessageConfigInterface) {}

  get recorder() {
    return this._config.recorder;
  }
}

export default VoiceMessageConfig;
