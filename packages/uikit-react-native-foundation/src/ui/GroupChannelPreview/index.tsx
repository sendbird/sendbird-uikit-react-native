import React from 'react';

import { conditionChaining } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import Image from '../../components/Image';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Badge from '../Badge';

type Props = {
  customCover?: React.ReactNode;
  coverUrl: string;

  title: string;

  titleCaption: string;
  titleCaptionLeft?: React.ReactNode;

  bodyIcon?: keyof typeof Icon.Assets;
  body: string;

  memberCount?: number;
  badgeCount: number;
  maxBadgeCount?: number;

  frozen?: boolean;
  notificationOff?: boolean;
  broadcast?: boolean;
  mentioned?: boolean;
  mentionTrigger?: string;
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
  titleCaptionLeft,
  frozen,
  notificationOff,
  broadcast,
  mentioned,
  mentionTrigger = '@',
}: Props) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelPreview;

  return (
    <Box style={[styles.container, { backgroundColor: color.default.none.background }]}>
      <Box style={styles.coverContainer}>
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
      </Box>
      <Box style={styles.rightSection}>
        <Box style={styles.rightTopSection}>
          <Box style={styles.channelInfoContainer}>
            {broadcast && (
              <Icon
                size={16}
                icon={'broadcast'}
                color={colors.secondary}
                containerStyle={styles.channelInfoBroadcast}
              />
            )}
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
          </Box>
          <Box style={styles.titleCaptionContainer}>
            {titleCaptionLeft}
            <Text caption2 color={color.default.none.textTitleCaption} style={styles.titleCaptionText}>
              {titleCaption}
            </Text>
          </Box>
        </Box>

        <Box style={styles.rightBottomSection}>
          <Box style={styles.body}>
            <Box style={styles.bodyWrapper}>
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
              <Box flex={1} alignItems={'flex-start'}>
                <Text
                  body3
                  numberOfLines={1}
                  ellipsizeMode={bodyIcon ? 'middle' : 'tail'}
                  color={color.default.none.textBody}
                >
                  {body}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box style={styles.unreadContainer}>
            {mentioned && (
              <Text h2 color={colors.ui.badge.default.none.background} style={styles.unreadMention}>
                {mentionTrigger}
              </Text>
            )}
            {badgeCount > 0 && <Badge count={badgeCount} maxCount={maxBadgeCount} />}
          </Box>
        </Box>
        <Separator color={color.default.none.separator} />
      </Box>
    </Box>
  );
};

type SeparatorProps = { color: string };
const Separator = ({ color }: SeparatorProps) => <Box style={[styles.separator, { backgroundColor: color }]} />;

const styles = createStyleSheet({
  container: {
    height: 76,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContainer: {
    marginStart: 16,
    marginEnd: 16,
  },
  channelCover: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  rightSection: {
    flex: 1,
    paddingTop: 10,
    paddingEnd: 16,
  },
  rightTopSection: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  channelInfoContainer: {
    flex: 1,
    marginEnd: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  channelInfoBroadcast: {
    marginEnd: 4,
  },
  channelInfoTitle: {
    flexShrink: 1,
    marginEnd: 4,
  },
  channelInfoMemberCount: {
    paddingTop: 2,
    marginEnd: 4,
  },
  channelInfoFrozen: {
    marginEnd: 4,
  },
  titleCaptionContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginStart: 4,
  },
  titleCaptionText: {
    marginTop: 2,
  },
  rightBottomSection: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
  },
  body: {
    marginEnd: 4,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bodyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyIcon: {
    borderRadius: 8,
    width: 26,
    height: 26,
    marginEnd: 4,
  },
  unreadContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadMention: {
    marginEnd: 4,
  },
  separator: {
    position: 'absolute',
    start: 0,
    end: -16,
    bottom: 0,
    height: 1,
  },
});

export default GroupChannelPreview;
