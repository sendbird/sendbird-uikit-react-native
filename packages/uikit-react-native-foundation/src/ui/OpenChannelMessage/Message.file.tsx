import React from 'react';

import { SendbirdFileMessage, getFileTypeFromMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import PressBox from '../../components/PressBox';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { OpenChannelMessageProps } from './index';

type Props = {};
const FileMessage = (props: OpenChannelMessageProps<SendbirdFileMessage, Props>) => {
  const { colors } = useUIKitTheme();
  const { onPress, onLongPress, ...rest } = props;
  const type = getFileTypeFromMessage(props.message);
  const color = colors.ui.openChannelMessage.default;

  return (
    <MessageContainer {...rest}>
      <PressBox onPress={onPress} onLongPress={onLongPress}>
        {({ pressed }) => {
          return (
            <Box
              padding={8}
              borderRadius={8}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'flex-start'}
              style={{ backgroundColor: pressed ? color.pressed.bubbleBackground : color.enabled.bubbleBackground }}
            >
              <Box
                padding={4}
                marginRight={8}
                borderRadius={8}
                alignItems={'flex-start'}
                backgroundColor={colors.background}
              >
                <Icon.File fileType={type} size={32} />
              </Box>
              <Text
                body3
                numberOfLines={1}
                ellipsizeMode={'middle'}
                color={color.enabled.textMsg}
                style={styles.fileName}
              >
                {props.strings?.fileName || props.message.name}
              </Text>
            </Box>
          );
        }}
      </PressBox>
    </MessageContainer>
  );
};

const styles = createStyleSheet({
  fileName: {
    flexShrink: 1,
  },
});
export default FileMessage;
