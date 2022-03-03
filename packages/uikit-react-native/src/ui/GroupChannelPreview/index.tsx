import React from 'react';
import { Image, View } from 'react-native';

import { Badge, Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { truncate } from '@sendbird/uikit-utils';

type Props = {
  coverUrl: string;

  title: string;
  titleCaption: string;
  bodyIcon?: keyof typeof Icon.Assets;
  body: string;

  memberCount?: number;
  badgeCount: number;

  frozen?: boolean;
  muted?: boolean;
};

//TODO: Extract colors to theme color-set
const GroupChannelPreview: React.FC<Props> = ({
  coverUrl,
  memberCount,
  badgeCount,
  body,
  bodyIcon,
  title,
  titleCaption,
  frozen,
  muted,
}) => {
  const { colors, select, palette } = useUIKitTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        resizeMode={'cover'}
        style={[styles.channelCover, { backgroundColor: colors.onBackground04 }]}
        source={{ uri: coverUrl }}
      />
      <View style={styles.rightSection}>
        <View style={styles.rightTopSection}>
          <View style={styles.channelInfo}>
            <Text subtitle1 style={styles.title}>
              {truncate(title, { mode: 'tail', maxLen: 15 })}
            </Text>
            {Boolean(memberCount) && (
              <Text caption1 style={styles.memberCount} color={colors.onBackground02}>
                {memberCount}
              </Text>
            )}
            {frozen && <Icon size={16} icon={'freeze'} color={colors.primary} containerStyle={styles.frozen} />}
            {muted && <Icon size={16} icon={'notifications-off-filled'} color={colors.onBackground03} />}
          </View>
          <View style={styles.titleCaption}>
            <Text caption2 color={colors.onBackground03}>
              {titleCaption}
            </Text>
          </View>
        </View>

        <View style={styles.rightBottomSection}>
          <View style={styles.body}>
            {bodyIcon && (
              <Icon
                size={18}
                icon={bodyIcon}
                color={colors.onBackground02}
                containerStyle={[
                  styles.bodyIcon,
                  { backgroundColor: select({ light: palette.background100, dark: palette.background500 }) },
                ]}
              />
            )}
            <Text body3 numberOfLines={1} style={styles.bodyText} color={colors.onBackground03}>
              {body}
            </Text>
          </View>
          {badgeCount > 0 && <Badge count={badgeCount} />}
        </View>
      </View>
      <Separator />
    </View>
  );
};

const Separator = () => {
  const { colors } = useUIKitTheme();
  return <View style={[styles.separator, { backgroundColor: colors.onBackground04 }]} />;
};

const styles = createStyleSheet({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  channelCover: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  rightSection: {
    flex: 1,
  },
  rightTopSection: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  channelInfo: {
    flex: 1,
    marginRight: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    marginRight: 4,
  },
  memberCount: {
    paddingTop: 2,
    marginRight: 4,
  },
  titleCaption: {
    paddingTop: 2,
  },
  rightBottomSection: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 32,
  },
  body: {
    marginRight: 4,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  bodyText: {
    flex: 1,
  },
  bodyIcon: {
    borderRadius: 8,
    width: 26,
    height: 26,
    marginRight: 4,
  },
  unreadBadge: {
    minWidth: 20,
    minHeight: 20,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frozen: {
    marginRight: 4,
  },
  separator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    height: 1,
    width: '84.5%',
  },
});

export default React.memo(GroupChannelPreview);
