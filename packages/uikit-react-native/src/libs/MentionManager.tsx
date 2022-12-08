import React from 'react';

import { Text, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdUser } from '@sendbird/uikit-utils';
import { createMentionTemplateRegex, replaceWithRegex } from '@sendbird/uikit-utils';

import type { MentionedUser, Range } from '../types';
import type { MentionConfigInterface } from './MentionConfig';

class MentionManager {
  private _invalidStartsKeywords: string[];
  private _templateRegex: RegExp;

  constructor(public config: MentionConfigInterface, public mentionEnabled: boolean) {
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
   * @description User to @{user.id} template format
   * */
  public asMentionedMessageTemplate = (user: SendbirdUser) => {
    return `${this.config.trigger}{${user.nickname}}${this.config.delimiter}`;
  };

  /**
   * @description User to @user.nickname text format
   * */
  public asMentionedMessageText = (user: SendbirdUser) => {
    return `${this.config.trigger}${user.nickname}${this.config.delimiter}`;
  };

  /**
   * @description Convert @{user.id} template to @user.nickname text and MentionedUser[] array.
   * */
  // public templateToMentionedText = (template: string, mentionedUsers: SendbirdUser[]) => {
  // const matches = [...template.matchAll(this.templateRegex)];
  // matches.map((value) => {
  // const matchedText = value[0];
  // const userId = value[2];
  // const start = value.index ?? 0;
  // const end = start + matchedText.length;
  // return { text, start, end, groups: value };
  //
  //   mentionedUsers.find((it) => it.userId === userId);
  // });
  // };

  /**
   * @description Bold @user.nickname
   * */
  public textToMentionedComponents = (text: string, mentionedUsers: MentionedUser[]) => {
    if (!this.mentionEnabled) return text;

    const { leftText, components } = mentionedUsers
      .sort((a, b) => b.range.start - a.range.start)
      .reduce(
        ({ leftText, components }, curr, currentIndex) => {
          const leftSpan = leftText.slice(0, curr.range.start);
          const mentionSpan = leftText.slice(curr.range.start, curr.range.end);
          const rightSpan = leftText.slice(curr.range.end);

          return {
            leftText: leftSpan,
            components: [
              <Text key={mentionSpan + currentIndex} style={styles.mentionedText}>
                {mentionSpan}
              </Text>,
              rightSpan,
              ...components,
            ],
          };
        },
        { leftText: text, components: [] as (string | JSX.Element)[] },
      );

    return [leftText, ...components];
  };
}

const styles = createStyleSheet({
  mentionedText: { fontWeight: 'bold' },
});

export default MentionManager;
