import React from 'react';
import { Image, View } from 'react-native';

import { Badge, Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

type Props = {
  customCover?: React.ReactElement;
  coverUrl: string;

  title: string;
  titleCaption: string;
  bodyIcon?: keyof typeof Icon.Assets;
  body: string;

  memberCount?: number;
  badgeCount: number;
  maxBadgeCount?: number;

  frozen?: boolean;
  notificationOff?: boolean;
};

//TODO: Extract colors to theme color-set
const GroupChannelPreview: React.FC<Props> = ({
  customCover,
  coverUrl,
  memberCount,
  badgeCount,
  maxBadgeCount,
  body,
  bodyIcon,
  title,
  titleCaption,
  frozen,
  notificationOff,
}) => {
  const { colors, select, palette } = useUIKitTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.coverContainer}>
        {customCover ? (
          customCover
        ) : (
          <Image
            resizeMode={'cover'}
            style={[styles.channelCover, { backgroundColor: colors.onBackground04 }]}
            source={{ uri: coverUrl }}
          />
        )}
      </View>
      <View style={styles.rightSection}>
        <View style={styles.rightTopSection}>
          <View style={styles.channelInfo}>
            <Text numberOfLines={1} subtitle1 style={styles.title}>
              {title}
            </Text>
            {Boolean(memberCount) && (
              <Text caption1 style={styles.memberCount} color={colors.onBackground02}>
                {memberCount}
              </Text>
            )}
            {frozen && <Icon size={16} icon={'freeze'} color={colors.primary} containerStyle={styles.frozen} />}
            {notificationOff && <Icon size={16} icon={'notifications-off-filled'} color={colors.onBackground03} />}
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
          {badgeCount > 0 && <Badge count={badgeCount} maxCount={maxBadgeCount} />}
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
  coverContainer: {
    marginRight: 16,
  },
  channelCover: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    flexShrink: 1,
    marginRight: 4,
  },
  memberCount: {
    paddingTop: 2,
  },
  titleCaption: {
    marginLeft: 4,
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
    height: 1,
    width: '84.5%',
  },
});

export default React.memo(GroupChannelPreview);
