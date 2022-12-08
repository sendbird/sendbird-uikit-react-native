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

const GroupChannelMentionSuggestionList = ({
  text,
  selection,
  inputHeight,
  bottomInset,
  onPressToMention,
  mentionedUsers,
}: GroupChannelProps['MentionSuggestionList']) => {
  const { width, height } = useWindowDimensions();
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

  const isLandscape = width > height;
  const maxHeight = isLandscape && keyboard.visible ? height - inputHeight - keyboard.height - topInset : 196;

  const renderMembers = () => {
    return members.map((member) => {
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
              {member.nickname}
            </Text>
            <Text body3 color={colors.onBackground03} numberOfLines={1} style={styles.userId}>
              {member.userId}
            </Text>
            <Divider style={{ position: 'absolute' }} />
          </View>
        </Pressable>
      );
    });
  };

  return (
    <ScrollView
      bounces={false}
      style={[
        styles.container,
        {
          maxHeight,
          borderTopColor: colors.onBackground04,
          backgroundColor: colors.background,
          bottom: inputHeight + bottomInset,
        },
      ]}
      contentContainerStyle={{ paddingLeft: left, paddingRight: right }}
    >
      {conditionChaining(
        [searchLimited, members.length === 0],
        [
          <View style={{ paddingHorizontal: 16, height: 44, flexDirection: 'row', alignItems: 'center' }}>
            <Icon icon={'info'} size={20} containerStyle={{ marginRight: 4 }} color={colors.onBackground02} />
            <Text body3 color={colors.onBackground02}>
              {STRINGS.GROUP_CHANNEL.MENTION_LIMITED(mentionManager.config.mentionLimit)}
            </Text>
          </View>,
          null,
          renderMembers(),
        ],
      )}
    </ScrollView>
  );
};

const styles = createStyleSheet({
  container: {
    borderTopWidth: 1,
    position: 'absolute',
    right: 0,
    left: 0,
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
});
export default GroupChannelMentionSuggestionList;
