import React from 'react';

import { replaceWithRegex } from '@sendbird/uikit-utils';

import Text, { TextProps } from '../Text';

interface Pattern {
  regex: RegExp;
  replacer(params: {
    match: string;
    groups: string[];
    index: number;
    keyPrefix: string;
    parentProps?: TextProps;
  }): string | JSX.Element;
}

type Props = { patterns: Pattern[] } & TextProps;

const RegexText = ({ children, patterns, ...props }: Props) => {
  if (patterns.length === 0 || typeof children !== 'string') return <>{children}</>;

  const matchedTexts: Array<string | JSX.Element> = [children];

  patterns.forEach(({ regex, replacer }, patterIndex) => {
    const matchedTextsTemp = matchedTexts.concat();
    let offset = 0;
    matchedTextsTemp.forEach((text, index) => {
      if (typeof text === 'string' && text) {
        const children = replaceWithRegex(
          text,
          regex,
          (params) => replacer({ ...params, parentProps: props, keyPrefix: index + params.keyPrefix }),
          String(patterIndex),
        );

        if (children.length > 1) {
          matchedTexts.splice(index + offset, 1, ...children);
          offset += children.length - 1;
        }
      }
    });
  });

  return <Text {...props}>{matchedTexts}</Text>;
};

export default RegexText;
