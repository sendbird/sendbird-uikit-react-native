import React from 'react';

import { conditionChaining, truncatedCount } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import Image from '../../components/Image';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = {
  customCover?: React.ReactNode;
  coverUrl: string;
  title: string;
  participantsCount?: number;
  frozen?: boolean;
};
const OpenChannelPreview = ({ customCover, coverUrl, participantsCount = 0, title, frozen }: Props) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.openChannelPreview.default.none;

  return (
    <Box
      backgroundColor={color.background}
      width={'100%'}
      height={62}
      flexDirection={'row'}
      alignItems={'center'}
      paddingHorizontal={16}
    >
      <Box
        width={styles.channelCover.width}
        height={styles.channelCover.height}
        borderRadius={styles.channelCover.width}
        overflow={'hidden'}
        marginRight={16}
      >
        {conditionChaining(
          [Boolean(customCover)],
          [
            customCover,
            <Image
              resizeMode={'cover'}
              style={[styles.channelCover, { backgroundColor: color.coverBackground }]}
              source={{ uri: coverUrl }}
            />,
          ],
        )}
      </Box>
      <Box flex={1} height={'100%'} justifyContent={'center'}>
        <Box flexDirection={'row'} flexShrink={1} marginBottom={4} alignItems={'center'}>
          <Text subtitle1 style={styles.channelInfoTitle} numberOfLines={1} color={color.textTitle}>
            {title}
          </Text>
          {frozen && <Icon size={16} icon={'freeze'} color={color.frozenIcon} containerStyle={styles.marginLeft} />}
        </Box>
        <Box flexDirection={'row'} flexShrink={1} alignItems={'center'} justifyContent={'flex-start'}>
          <Box flexDirection={'row'} alignItems={'center'}>
            <Icon size={16} icon={'members'} color={color.participantsIcon} containerStyle={styles.marginRight} />
            <Text caption2 color={color.textParticipants}>
              {truncatedCount(participantsCount, 999)}
            </Text>
          </Box>
        </Box>
        <Separator color={color.separator} />
      </Box>
    </Box>
  );
};

const Separator = ({ color }: { color: string }) => <Box style={[styles.separator, { backgroundColor: color }]} />;

const styles = createStyleSheet({
  channelCover: {
    width: 32,
    height: 32,
  },
  channelInfoTitle: {
    flexShrink: 1,
  },
  marginRight: {
    marginRight: 4,
  },
  marginLeft: {
    marginLeft: 4,
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: -16,
    bottom: 0,
    height: 1,
  },
});

export default OpenChannelPreview;
