import React from 'react';

import {
  Box,
  ImageWithPlaceholder,
  PressBox,
  RegexText,
  type RegexTextPattern,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { SendbirdUserMessage, urlRegexStrict, useFreshCallback } from '@sendbird/uikit-utils';

import { useSendbirdChat } from './../../hooks/useContext';
import { ThreadParentMessageRendererProps } from './index';

type Props = ThreadParentMessageRendererProps<{
  regexTextPatterns?: RegexTextPattern[];
  renderRegexTextChildren?: (message: SendbirdUserMessage) => string;
}>;

const ThreadParentMessageUserOg = (props: Props) => {
  const userMessage: SendbirdUserMessage = props.parentMessage as SendbirdUserMessage;
  if (!userMessage) return null;

  const { sbOptions } = useSendbirdChat();
  const { select, colors, palette } = useUIKitTheme();
  const enableOgtag = sbOptions.uikitWithAppInfo.groupChannel.channel.enableOgtag;
  const onPressMessage = (userMessage: SendbirdUserMessage) =>
    useFreshCallback(() => {
      typeof userMessage.ogMetaData?.url === 'string' && props.onPressURL?.(userMessage.ogMetaData.url);
    });

  return (
    <Box>
      <PressBox activeOpacity={0.85} onPress={onPressMessage(userMessage)}>
        <Text body3 color={colors.onBackground01} suppressHighlighting>
          <RegexText
            body3
            color={colors.onBackground01}
            patterns={[
              ...(props.regexTextPatterns ?? []),
              {
                regex: urlRegexStrict,
                replacer({ match, parentProps, keyPrefix, index }) {
                  return (
                    <Text
                      {...parentProps}
                      key={`${keyPrefix}-${index}`}
                      onPress={() => props.onPressURL?.(match)}
                      style={[parentProps?.style, styles.urlText]}
                    >
                      {match}
                    </Text>
                  );
                },
              },
            ]}
          >
            {props.renderRegexTextChildren?.(userMessage)}
          </RegexText>
          {Boolean(userMessage.updatedAt) && (
            <Text body3 color={colors.onBackground02}>
              {' (edited)'}
            </Text>
          )}
        </Text>
      </PressBox>
      {userMessage.ogMetaData && enableOgtag && (
        <PressBox onPress={onPressMessage(userMessage)} style={styles.container}>
          <Box>
            {!!userMessage.ogMetaData.defaultImage && (
              <ImageWithPlaceholder style={styles.ogImage} source={{ uri: userMessage.ogMetaData.defaultImage.url }} />
            )}
            <Box
              style={styles.ogContainer}
              backgroundColor={select({ dark: palette.background400, light: palette.background100 })}
            >
              <Text numberOfLines={3} body2 color={colors.onBackground01} style={styles.ogTitle}>
                {userMessage.ogMetaData.title}
              </Text>
              {!!userMessage.ogMetaData.description && (
                <Text numberOfLines={1} caption2 color={colors.onBackground01} style={styles.ogDesc}>
                  {userMessage.ogMetaData.description}
                </Text>
              )}
              <Text numberOfLines={1} caption2 color={colors.onBackground02}>
                {userMessage.ogMetaData.url}
              </Text>
            </Box>
          </Box>
        </PressBox>
      )}
    </Box>
  );
};

const styles = createStyleSheet({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ogContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    maxWidth: 240,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  ogImage: {
    width: 240,
    height: 136,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ogUrl: {
    marginBottom: 4,
  },
  ogTitle: {
    marginBottom: 4,
  },
  ogDesc: {
    lineHeight: 14,
    marginBottom: 8,
  },
  urlText: {
    textDecorationLine: 'underline',
  },
});

export default ThreadParentMessageUserOg;
