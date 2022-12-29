import React, { useContext } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar,
  Divider,
  Icon,
  Text,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { conditionChaining } from '@sendbird/uikit-utils';

import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import useKeyboardStatus from '../../../hooks/useKeyboardStatus';
import useMentionSuggestion from '../../../hooks/useMentionSuggestion';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelSuggestedMentionList = ({
  text,
  selection,
  inputHeight,
  bottomInset,
  onPressToMention,
  mentionedUsers,
}: GroupChannelProps['SuggestedMentionList']) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { channel } = useContext(GroupChannelContexts.Fragment);
  const { mentionManager } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const { topInset } = useHeaderStyle();
  const { left, right } = useSafeAreaInsets();

  const keyboard = useKeyboardStatus();

  const { members, reset, searchStringRange, searchLimited } = useMentionSuggestion({
    text,
    selection,
    channel,
    mentionedUsers,
  });

  const isLandscape = screenWidth > screenHeight;
  const isShortened = isLandscape && keyboard.visible;
  const canRenderMembers = members.length > 0;
  const maxHeight = isShortened ? screenHeight - (topInset + inputHeight + keyboard.height) : styles.suggestion.height;

  const renderLimitGuide = () => {
    return (
      <View style={[styles.searchLimited, { borderTopColor: colors.onBackground04 }]}>
        <Icon icon={'info'} size={20} containerStyle={{ marginRight: 4 }} color={colors.onBackground02} />
        <Text body3 color={colors.onBackground02}>
          {STRINGS.GROUP_CHANNEL.MENTION_LIMITED(mentionManager.config.mentionLimit)}
        </Text>
      </View>
    );
  };

  const renderMembers = () => {
    return (
      <View>
        {members.map((member) => {
          return (
            <Pressable
              onPress={() => {
                onPressToMention(member, searchStringRange);
                reset();
              }}
              key={member.userId}
              style={styles.userContainer}
            >
              <Avatar size={28} uri={member.profileUrl} containerStyle={styles.userAvatar} />
              <View style={styles.userInfo}>
                <Text body2 color={colors.onBackground01} numberOfLines={1} style={styles.userNickname}>
                  {member.nickname || STRINGS.LABELS.USER_NO_NAME}
                </Text>
                <Text body3 color={colors.onBackground03} numberOfLines={1} style={styles.userId}>
                  {member.userId}
                </Text>
                <Divider style={{ position: 'absolute', bottom: 0 }} />
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <Pressable
      onPress={reset}
      pointerEvents={canRenderMembers ? 'auto' : 'none'}
      style={[styles.container, { bottom: inputHeight + bottomInset }]}
    >
      <ScrollView
        bounces={false}
        keyboardDismissMode={'none'}
        keyboardShouldPersistTaps={'always'}
        style={[
          styles.scrollView,
          {
            maxHeight,
            backgroundColor: colors.background,
            bottom: keyboard.bottomSpace,
          },
          canRenderMembers && {
            borderTopWidth: 1,
            borderTopColor: colors.onBackground04,
          },
        ]}
        contentContainerStyle={{ paddingLeft: left, paddingRight: right }}
      >
        {conditionChaining([searchLimited, canRenderMembers], [renderLimitGuide(), renderMembers(), null])}
      </ScrollView>
    </Pressable>
  );
};

const styles = createStyleSheet({
  suggestion: {
    height: 196,
  },
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  scrollView: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  userContainer: {
    paddingLeft: 16,
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    marginRight: 16,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userNickname: {
    flexShrink: 1,
    lineHeight: 44,
    textAlignVertical: 'center',
    marginRight: 6,
  },
  userId: {
    lineHeight: 44,
    textAlignVertical: 'center',
    minWidth: 32,
    flexShrink: 1,
    marginRight: 16,
  },
  searchLimited: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default GroupChannelSuggestedMentionList;
