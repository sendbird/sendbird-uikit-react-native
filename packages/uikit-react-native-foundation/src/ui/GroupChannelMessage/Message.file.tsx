import React, { useContext } from 'react';

import { SendbirdFileMessage, getFileExtension, getFileType, truncate } from '@gathertown/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import PressBox from '../../components/PressBox';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';
import { CustomComponentContext } from '../../context/CustomComponentCtx';

export type FileMessageRenderProp = (props: { 
  children: React.ReactNode;
  message: SendbirdFileMessage;
  pressed: boolean;
  fileType: 'video' | 'audio' | 'image' | 'file';
  fileName: string;
  defaultIcon?: React.ReactNode;
}) => React.ReactElement;

type Props = GroupChannelMessageProps<SendbirdFileMessage>;

const FileMessage = (props: Props) => {
  const { variant = 'incoming', message, children } = props;
  const { colors } = useUIKitTheme();
  const ctx = useContext(CustomComponentContext);

  const fileType = getFileType(props.message.type || getFileExtension(props.message.name));
  const color = colors.ui.groupChannelMessage[variant];
  const icon = (
    <Icon.File
      fileType={fileType}
      size={24}
      containerStyle={{ backgroundColor: colors.background, padding: 2, borderRadius: 8, marginRight: 8 }}
    />
  );

  return (
    <MessageContainer {...props}>
      <PressBox onPress={props.onPress} onLongPress={props.onLongPress}>
        {({ pressed }) => ctx?.renderFileMessage ? ctx.renderFileMessage({
          message,
          pressed,
          fileType,
          fileName: props.strings?.fileName || props.message.name,
          children,
          defaultIcon: icon,
        }) : (
          <Box backgroundColor={pressed ? color.pressed.background : color.enabled.background} style={styles.container}>
            <Box style={styles.bubble}>
              {icon}
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
