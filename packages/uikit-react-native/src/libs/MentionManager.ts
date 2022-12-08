import type { SendbirdUser } from '@sendbird/uikit-utils';
import { createMentionTemplateRegex } from '@sendbird/uikit-utils';

import type { Range } from '../types';
import type { MentionConfigInterface } from './MentionConfig';

class MentionManager {
  private _invalidStartsKeywords: string[];
  private _templateRegex: RegExp;

  constructor(public config: MentionConfigInterface) {
    this._invalidStartsKeywords = [this.config.trigger, this.config.delimiter];
    this._templateRegex = createMentionTemplateRegex(this.config.trigger);
  }

  public get templateRegex() {
    return this._templateRegex;
  }

  public findSearchString = (text: string, selectionIndex: number) => {
    const lastSpan = text.slice(0, selectionIndex).split(this.config.delimiter).pop() ?? '';
    const triggerIdx = lastSpan.indexOf(this.config.trigger);
    const mentionSpan = triggerIdx === -1 ? lastSpan : lastSpan.slice(triggerIdx);
    const searchString = mentionSpan.slice(this.config.trigger.length);

    return {
      searchString,
      isTriggered: () => mentionSpan.startsWith(this.config.trigger),
      isValidSearchString: () => this._invalidStartsKeywords.every((it) => !searchString.startsWith(it)),
    };
  };

  public getSearchStringRangeInText = (selectionIndex: number, searchString: string): Range => {
    return {
      start: selectionIndex - searchString.length - this.config.trigger.length,
      end: selectionIndex,
    };
  };

  /**
   * @example @{user.id}
   * */
  public asMentionedMessageTemplate = (user: SendbirdUser) => {
    return `${this.config.trigger}{${user.nickname}}${this.config.delimiter}`;
  };

  /**
   * @example @user.nickname
   * */
  public asMentionedMessageText = (user: SendbirdUser) => {
    return `${this.config.trigger}${user.nickname}${this.config.delimiter}`;
  };
}

export default MentionManager;
