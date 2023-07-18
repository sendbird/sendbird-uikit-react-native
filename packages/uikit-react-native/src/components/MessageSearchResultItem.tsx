import React from 'react';

import {
  Avatar,
  Box,
  FileIcon,
  PressBox,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdBaseMessage } from '@sendbird/uikit-utils';
import { getFileExtension, getFileType, useIIFE } from '@sendbird/uikit-utils';

import type { MessageSearchProps } from '../domain/messageSearch/types';
import { useLocalization } from '../hooks/useContext';

const MessageSearchResultItem: MessageSearchProps['List']['renderSearchResultItem'] = ({ onPress, message }) => {
  const { colors, select, palette } = useUIKitTheme();
  const { STRINGS } = useLocalization();

  const fileType = useIIFE(() => {
    if (!message?.isFileMessage()) return undefined;
    return getFileType(message.type || getFileExtension(message.name));
  });

  return (
    <PressBox onPress={onPress}>
      <Box style={styles.container}>
        <Avatar size={styles.avatarSize.width} uri={getSenderProfile(message)} containerStyle={styles.avatar} />

        <Box flex={1} paddingRight={16}>
          <Box style={styles.titleLine}>
            <Box flex={1} marginRight={4} justifyContent={'center'}>
              <Text subtitle2 color={colors.onBackground01} numberOfLines={1}>
                {STRINGS.MESSAGE_SEARCH.SEARCH_RESULT_ITEM_TITLE(message)}
              </Text>
            </Box>
            <Box paddingTop={2}>
              <Text caption2 color={colors.onBackground02}>
                {STRINGS.MESSAGE_SEARCH.SEARCH_RESULT_ITEM_TITLE_CAPTION(message)}
              </Text>
            </Box>
          </Box>

          <Box flex={1}>
            <Box alignItems={'center'} flexDirection={'row'}>
              {fileType && (
                <FileIcon
                  size={18}
                  fileType={fileType}
                  color={colors.onBackground02}
                  containerStyle={[
                    styles.bodyIcon,
                    { backgroundColor: select({ light: palette.background100, dark: palette.background500 }) },
                  ]}
                />
              )}

              <Text
                body3
                numberOfLines={fileType ? 1 : 2}
                ellipsizeMode={fileType ? 'middle' : 'tail'}
                style={styles.bodyText}
                color={colors.onBackground03}
              >
                {STRINGS.MESSAGE_SEARCH.SEARCH_RESULT_ITEM_BODY(message)}
              </Text>
            </Box>
          </Box>

          <Box style={styles.separator} backgroundColor={colors.onBackground04} />
        </Box>
      </Box>
    </PressBox>
  );
};

function getSenderProfile(message: SendbirdBaseMessage) {
  if (message.isUserMessage() || message.isFileMessage()) {
    return message.sender.profileUrl;
  } else {
    return undefined;
  }
}

const styles = createStyleSheet({
  container: {
    height: 76,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    marginHorizontal: 16,
  },
  avatarSize: {
    width: 56,
  },
  titleLine: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 4,
  },
  bodyIcon: {
    borderRadius: 8,
    width: 26,
    height: 26,
    marginRight: 4,
  },
  bodyText: {
    flex: 1,
    lineHeight: 16,
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: -16,
    bottom: 0,
    height: 1,
  },
});

export default MessageSearchResultItem;
