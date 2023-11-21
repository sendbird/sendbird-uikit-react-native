import React, { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { conditionChaining } from '@sendbird/uikit-utils';

import Icon from '../../components/Icon';
import Image from '../../components/Image';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import AvatarGroup from './AvatarGroup';
import AvatarIcon from './AvatarIcon';
import AvatarStack from './AvatarStack';

type Props = {
  uri?: string;
  size?: number;
  square?: boolean;
  muted?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

const Avatar = ({ uri, square, muted = false, size = 56, containerStyle }: Props) => {
  const { colors, palette } = useUIKitTheme();
  const [loadFailure, setLoadFailure] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: square ? 0 : size / 2, backgroundColor: palette.background300 },
        containerStyle,
      ]}
    >
      {conditionChaining(
        [Boolean(uri) && !loadFailure],
        [
          <Image
            onError={() => setLoadFailure(true)}
            source={{ uri }}
            resizeMode={'cover'}
            style={StyleSheet.absoluteFill}
          />,
          <Icon icon={'user'} size={size / 2} color={colors.onBackgroundReverse01} />,
        ],
      )}
      {muted && <MutedOverlay size={size} />}
    </View>
  );
};

const MutedOverlay = ({ size }: { size: number }) => {
  const { palette } = useUIKitTheme();
  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.primary300, opacity: 0.5 }]} />
      <Icon color={palette.onBackgroundDark01} icon={'mute'} size={size * 0.72} />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default Object.assign(Avatar, {
  Group: AvatarGroup,
  Icon: AvatarIcon,
  Stack: AvatarStack,
});
