import React from 'react';

import { SendbirdFileMessage, getFileExtension, getFileType, truncate } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import PressBox from '../../components/PressBox';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

type Props = GroupChannelMessageProps<SendbirdFileMessage>;

const FileMessage = (props: Props) => {
  const { variant = 'incoming' } = props;
  const { colors } = useUIKitTheme();

  const fileType = getFileType(props.message.type || getFileExtension(props.message.name));
  const color = colors.ui.groupChannelMessage[variant];

  return (
    <MessageContainer {...props}>
      <PressBox onPress={props.onPress} onLongPress={props.onLongPress}>
        {({ pressed }) => (
          <Box backgroundColor={pressed ? color.pressed.background : color.enabled.background} style={styles.container}>
            <Box style={styles.bubble}>
              <Icon.File
                fileType={fileType}
                size={24}
                containerStyle={{ backgroundColor: colors.background, padding: 2, borderRadius: 8, marginRight: 8 }}
              />
              <Text
                body3
                ellipsizeMode={'middle'}
                numberOfLines={1}
                color={pressed ? color.pressed.textMsg : color.enabled.textMsg}
                style={styles.name}
              >
                {truncate(props.strings?.fileName || props.message.name, { mode: 'mid', maxLen: 20 })}
              </Text>
            </Box>
            {props.children}
          </Box>
        )}
      </PressBox>
    </MessageContainer>
  );
};

const styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  name: {
    flexShrink: 1,
  },
});

export default FileMessage;
