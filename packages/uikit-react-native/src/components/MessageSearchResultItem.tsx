import React from 'react';

import {
  Avatar,
  Box,
  Icon,
  PressBox,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdBaseMessage } from '@sendbird/uikit-utils';
import { getFileExtension, getFileType, useIIFE } from '@sendbird/uikit-utils';

import type { MessageSearchProps } from '../domain/messageSearch/types';
import { useLocalization } from '../hooks/useContext';

const iconMapper = { audio: 'file-audio', image: 'photo', video: 'play', file: 'file-document' } as const;

export const MessageSearchResultItem: MessageSearchProps['List']['renderSearchResultItem'] = ({ onPress, message }) => {
  const { colors, select, palette } = useUIKitTheme();
  const { STRINGS } = useLocalization();

  const fileIcon = useIIFE(() => {
    if (!message?.isFileMessage()) return undefined;
    return iconMapper[getFileType(message.type || getFileExtension(message.name))];
  });

  return (
    <PressBox onPress={onPress}>
      <Box height={76} width={'100%'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
        <Avatar size={56} uri={getSenderProfile(message)} containerStyle={styles.avatar} />

        <Box flex={1} paddingRight={16}>
          <Box flexDirection={'row'} paddingTop={10}>
            <Box flex={1} marginRight={4} justifyContent={'center'}>
              <Text subtitle2 color={colors.onBackground01} numberOfLines={1} style={styles.title}>
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
              {fileIcon && (
                <Icon
                  size={18}
                  icon={fileIcon}
                  color={colors.onBackground02}
                  containerStyle={[
                    styles.bodyIcon,
                    { backgroundColor: select({ light: palette.background100, dark: palette.background500 }) },
                  ]}
                />
              )}

              <Text
                body3
                numberOfLines={2}
                ellipsizeMode={fileIcon ? 'middle' : 'tail'}
                style={{ flex: 1 }}
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
  avatar: {
    marginHorizontal: 16,
  },
  title: {
    marginBottom: 4,
  },
  bodyIcon: {
    borderRadius: 8,
    width: 26,
    height: 26,
    marginRight: 4,
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: -16,
    bottom: 0,
    height: 1,
  },
});
