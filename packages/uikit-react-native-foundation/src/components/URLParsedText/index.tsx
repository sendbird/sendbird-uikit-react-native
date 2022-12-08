import React from 'react';
import { Linking } from 'react-native';

import { Logger, replaceUrlAsComponents } from '@sendbird/uikit-utils';

import createStyleSheet from '../../styles/createStyleSheet';
import type { TextProps } from '../Text';
import Text from '../Text';

type OnPressUrl = (url: string, httpProtocol: boolean) => void;

const openUrl: OnPressUrl = (url, httpProtocol) => {
  const targetUrl = httpProtocol ? url : 'https://' + url;
  Linking.openURL(targetUrl).catch((err) => Logger.warn('[URLParsedText]', 'Cannot open url', err));
};

type Props = TextProps & {
  onPressUrl?: OnPressUrl;
  strict?: boolean;
};
const URLParsedText = ({ children, onPressUrl = openUrl, strict, ...props }: Props) => {
  const parsedChildren = React.Children.map(React.Children.toArray(children), (child) => {
    if (typeof child === 'string') {
      return replaceUrlAsComponents(
        child,
        (url) => {
          return (
            <Text
              {...props}
              suppressHighlighting
              onPress={() => onPressUrl?.(url, url.startsWith('http'))}
              style={[props.style, styles.url]}
            >
              {url}
            </Text>
          );
        },
        strict,
      );
    }

    return child;
  });

  return <Text {...props}>{parsedChildren}</Text>;
};
const styles = createStyleSheet({
  url: { textDecorationLine: 'underline' },
});
export default URLParsedText;
