import React from 'react';

import type { SendbirdUserMessage } from '@sendbird/uikit-utils';
import { urlRegexStrict } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import PressBox from '../../components/PressBox';
import RegexText from '../../components/RegexText';
import Text from '../../components/Text';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { OpenChannelMessageProps } from './index';

type Props = {};
const UserMessage = (props: OpenChannelMessageProps<SendbirdUserMessage, Props>) => {
  const { colors } = useUIKitTheme();
  const { onPress, onLongPress, onPressURL, ...rest } = props;
  const color = colors.ui.openChannelMessage.default;

  return (
    <PressBox onPress={onPress} onLongPress={onLongPress}>
      {({ pressed }) => (
        <MessageContainer pressed={pressed} {...rest}>
          <Box alignItems={'flex-start'}>
            <Text
              body3
              color={color.enabled.textMsg}
              suppressHighlighting
              supportRTLAlign
              originalText={props.message.message}
            >
              <RegexText
                body3
                suppressHighlighting
                supportRTLAlign
                originalText={props.message.message}
                color={color.enabled.textMsg}
                patterns={[
                  {
                    regex: urlRegexStrict,
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
                <Text
                  body3
                  color={color.enabled.textMsgPostfix}
                  supportRTLAlign
                  originalText={props.strings?.edited ?? ' (edited)'}
                >
                  {props.strings?.edited ?? ' (edited)'}
                </Text>
              )}
            </Text>
          </Box>
        </MessageContainer>
      )}
    </PressBox>
  );
};

export default UserMessage;
