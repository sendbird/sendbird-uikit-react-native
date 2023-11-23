import React, { useEffect, useRef } from 'react';
import { Platform, TextInput } from 'react-native';

import {
  Box,
  Icon,
  PressBox,
  Text,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../hooks/useContext';
import type { MessageSearchProps } from '../types';

const MessageSearchHeader = ({
  keyword,
  onChangeKeyword,
  onPressHeaderLeft,
  onPressHeaderRight,
}: MessageSearchProps['Header']) => {
  const { HeaderComponent } = useHeaderStyle();
  const { colors } = useUIKitTheme();
  const { STRINGS } = useLocalization();

  const inputRef = useRef<TextInput>(null);
  const inputColor = colors.ui.input.default.active;
  const searchEnabled = keyword.length > 0;

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, Platform.select({ ios: 500, default: 0 }));
  }, []);

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <Box
          flex={1}
          height={36}
          alignItems={'center'}
          backgroundColor={inputColor.background}
          borderRadius={24}
          paddingHorizontal={10}
          flexDirection={'row'}
        >
          <Icon size={24} icon={'search'} color={colors.onBackground03} containerStyle={styles.searchIcon} />
          <TextInput
            disableFullscreenUI
            enablesReturnKeyAutomatically
            ref={inputRef}
            returnKeyType={'search'}
            onSubmitEditing={() => onPressHeaderRight()}
            selectionColor={colors.primary}
            placeholder={STRINGS.MESSAGE_SEARCH.HEADER_INPUT_PLACEHOLDER}
            placeholderTextColor={inputColor.placeholder}
            style={[styles.input, { color: inputColor.text }]}
            value={keyword}
            onChangeText={onChangeKeyword}
          />
          {searchEnabled && (
            <PressBox onPress={() => onChangeKeyword('')}>
              <Icon size={18} icon={'remove'} color={colors.onBackground03} containerStyle={styles.clearIcon} />
            </PressBox>
          )}
        </Box>
      }
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={
        <Text button color={searchEnabled ? colors.primary : colors.onBackground04}>
          {STRINGS.MESSAGE_SEARCH.HEADER_RIGHT}
        </Text>
      }
      onPressRight={searchEnabled ? onPressHeaderRight : undefined}
    />
  );
};

const styles = createStyleSheet({
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
});

export default MessageSearchHeader;
