import React from 'react';
import { View } from 'react-native';

import { conditionChaining } from '@sendbird/uikit-utils';

import Image from '../../components/Image';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Badge from '../Badge';
import Icon from '../Icon';
import Text from '../Text';

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

const GroupChannelPreview = ({
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
}: Props) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelPreview;

  return (
    <View style={[styles.container, { backgroundColor: color.default.none.background }]}>
      <View style={styles.coverContainer}>
        {conditionChaining(
          [Boolean(customCover)],
          [
            customCover,
            <Image
              resizeMode={'cover'}
              style={[styles.channelCover, { backgroundColor: color.default.none.coverBackground }]}
              source={{ uri: coverUrl }}
            />,
          ],
        )}
      </View>
      <View style={styles.rightSection}>
        <View style={styles.rightTopSection}>
          <View style={styles.channelInfo}>
            <Text numberOfLines={1} subtitle1 style={styles.channelInfoTitle} color={color.default.none.textTitle}>
              {title}
            </Text>
            {Boolean(memberCount) && (
              <Text caption1 style={styles.channelInfoMemberCount} color={color.default.none.memberCount}>
                {memberCount}
              </Text>
            )}
            {frozen && (
              <Icon size={16} icon={'freeze'} color={colors.primary} containerStyle={styles.channelInfoFrozen} />
            )}
            {notificationOff && <Icon size={16} icon={'notifications-off-filled'} color={colors.onBackground03} />}
          </View>
          <View style={styles.titleCaption}>
            <Text caption2 color={color.default.none.textTitleCaption}>
              {titleCaption}
            </Text>
          </View>
        </View>

        <View style={styles.rightBottomSection}>
          <View style={[styles.body, bodyIcon && { alignItems: 'center' }]}>
            {bodyIcon && (
              <Icon
                size={18}
                icon={bodyIcon}
                color={color.default.none.bodyIcon}
                containerStyle={[
                  styles.bodyIcon,
                  { backgroundColor: colors.ui.groupChannelPreview.default.none.bodyIconBackground },
                ]}
              />
            )}
            <Text body3 numberOfLines={1} style={styles.bodyText} color={color.default.none.textBody}>
              {body}
            </Text>
          </View>
          <View>{badgeCount > 0 && <Badge count={badgeCount} maxCount={maxBadgeCount} />}</View>
        </View>
      </View>
      <Separator color={color.default.none.separator} />
    </View>
  );
};

type SeparatorProps = { color: string };
const Separator = ({ color }: SeparatorProps) => <View style={[styles.separator, { backgroundColor: color }]} />;

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
  channelInfoTitle: {
    flexShrink: 1,
    marginRight: 4,
  },
  channelInfoMemberCount: {
    paddingTop: 2,
    marginRight: 4,
  },
  channelInfoFrozen: {
    marginRight: 4,
  },
  titleCaption: {
    marginLeft: 4,
    paddingTop: 2,
  },
  rightBottomSection: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
  },
  body: {
    marginRight: 4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  separator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 1,
    width: '84.5%',
  },
});

export default React.memo(GroupChannelPreview);
