import React from 'react';

import { Box, Icon, PressBox, Text, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { SendbirdFileMessage, getFileExtension, getFileType, truncate } from '@sendbird/uikit-utils';

import { useLocalization } from './../../hooks/useContext';
import { ThreadParentMessageRendererProps } from './index';

const ThreadParentMessageFile = (props: ThreadParentMessageRendererProps) => {
  const fileMessage: SendbirdFileMessage = props.parentMessage as SendbirdFileMessage;
  if (!fileMessage) return null;

  const { STRINGS } = useLocalization();
  const { select, colors, palette } = useUIKitTheme();

  const fileType = getFileType(fileMessage.type || getFileExtension(fileMessage.name));
  const fileName = STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_FILE_TITLE(fileMessage) ?? fileMessage.name;

  return (
    <Box
      style={styles.fileBubbleContainer}
      backgroundColor={select({ light: palette.background100, dark: palette.background400 })}
    >
      <PressBox onPress={props.onPress} onLongPress={props.onLongPress}>
        <Box style={styles.iconBackground}>
          <Icon.File
            fileType={fileType}
            size={24}
            containerStyle={{ backgroundColor: palette.background50, borderRadius: 8 }}
          />
          <Text body3 numberOfLines={1} color={colors.onBackground01} style={styles.name}>
            {truncate(fileName, { mode: 'mid', maxLen: 30 })}
          </Text>
        </Box>
      </PressBox>
    </Box>
  );
};

const styles = createStyleSheet({
  fileBubbleContainer: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconBackground: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flexShrink: 1,
    marginLeft: 8,
  },
});

export default ThreadParentMessageFile;
