import React from 'react';

import type { SendbirdUserMessage } from '@sendbird/uikit-utils';
import { urlRegexRough } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import ImageWithPlaceholder from '../../components/ImageWithPlaceholder';
import PressBox from '../../components/PressBox';
import RegexText from '../../components/RegexText';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { OpenChannelMessageProps } from './index';

type Props = {};
const OpenGraphUserMessage = (props: OpenChannelMessageProps<SendbirdUserMessage, Props>) => {
  const { colors } = useUIKitTheme();
  const { onPress, onLongPress, onPressURL, ...rest } = props;
  const color = colors.ui.openChannelMessage.default;

  return (
    <Box>
      <PressBox onPress={onPress} onLongPress={onLongPress}>
        {({ pressed }) => (
          <MessageContainer pressed={pressed} {...rest}>
            <Text body3 color={color.enabled.textMsg}>
              <RegexText
                body3
                color={color.enabled.textMsg}
                patterns={[
                  {
                    regex: urlRegexRough,
                    replacer({ match, parentProps, keyPrefix, index }) {
                      return (
                        <Text
                          {...parentProps}
                          key={`${keyPrefix}-${index}`}
                          onPress={() => onPressURL?.(match)}
                          onLongPress={onLongPress}
                          color={colors.primary}
                          style={parentProps?.style}
                        >
                          {match}
                        </Text>
                      );
                    },
                  },
                ]}
              >
                {props.message.message}
              </RegexText>
              {Boolean(props.message.updatedAt) && (
                <Text body3 color={color.enabled.textMsgPostfix}>
                  {props.strings?.edited ?? ' (edited)'}
                </Text>
              )}
            </Text>
          </MessageContainer>
        )}
      </PressBox>
      {props.message.ogMetaData && (
        <MessageContainer {...rest} grouped>
          <PressBox
            style={styles.ogContainer}
            onPress={() => props.message.ogMetaData?.url && onPressURL?.(props.message.ogMetaData.url)}
            onLongPress={onLongPress}
          >
            {({ pressed }) =>
              props.message.ogMetaData && (
                <Box
                  padding={8}
                  borderRadius={8}
                  style={styles.ogContainer}
                  backgroundColor={pressed ? color.pressed.bubbleBackground : color.enabled.bubbleBackground}
                >
                  <Text numberOfLines={1} caption2 color={colors.onBackground02} style={styles.ogUrl}>
                    {props.message.ogMetaData.url}
                  </Text>

                  <Text numberOfLines={2} body2 color={colors.primary} style={styles.ogTitle}>
                    {props.message.ogMetaData.title}
                  </Text>

                  {Boolean(props.message.ogMetaData.description) && (
                    <Text numberOfLines={2} caption2 color={colors.onBackground01}>
                      {props.message.ogMetaData.description}
                    </Text>
                  )}

                  {!!props.message.ogMetaData.defaultImage && (
                    <ImageWithPlaceholder
                      style={styles.ogImage}
                      source={{ uri: props.message.ogMetaData.defaultImage.url }}
                    />
                  )}
                </Box>
              )
            }
          </PressBox>
        </MessageContainer>
      )}
    </Box>
  );
};

const styles = createStyleSheet({
  ogContainer: {
    maxWidth: 296,
  },
  ogUrl: {
    marginBottom: 4,
  },
  ogTitle: {
    marginBottom: 8,
  },
  ogImage: {
    width: '100%',
    height: 156,
    marginTop: 12,
  },
});

export default OpenGraphUserMessage;
