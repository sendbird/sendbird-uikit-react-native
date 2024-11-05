export interface MentionConfigInterface {
  mentionLimit: number;
  suggestionLimit: number;
  debounceMills: number;
  delimiter: string;
  trigger: string;
  /**
   * This configuration keeps the trigger positioned to the left in RTL mode, instead of being placed after `username@`.
   * @example
   *  RTL: `@username`
   *  LTR: `@username`
   */
  forceTriggerLeftInRTL: boolean;
}

class MentionConfig {
  static DEFAULT = {
    MENTION_LIMIT: 10,
    SUGGESTION_LIMIT: 15,
    DEBOUNCE_MILLS: 300,
    DELIMITER: ' ',
    TRIGGER: '@',
    FORCE_TRIGGER_LEFT_IN_RTL: true,
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

  get forceTriggerLeftInRTL() {
    return this._config.forceTriggerLeftInRTL;
  }
}

export default MentionConfig;
