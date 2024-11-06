export interface MentionConfigInterface {
  mentionLimit: number;
  suggestionLimit: number;
  debounceMills: number;
  delimiter: string;
  trigger: string;
}

class MentionConfig {
  static DEFAULT = {
    MENTION_LIMIT: 10,
    SUGGESTION_LIMIT: 15,
    DEBOUNCE_MILLS: 300,
    DELIMITER: ' ',
    TRIGGER: '@',
  };
  constructor(private _config: MentionConfigInterface) {}

  get mentionLimit() {
    return this._config.mentionLimit;
  }

  get suggestionLimit() {
    return this._config.suggestionLimit;
  }

  get delimiter() {
    return this._config.delimiter;
  }

  get debounceMills() {
    return this._config.debounceMills;
  }

  get trigger() {
    return this._config.trigger;
  }
}

export default MentionConfig;
