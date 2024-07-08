import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { useForceUpdate } from '@sendbird/uikit-utils';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Box from '../Box';
import Icon from '../Icon';
import Image from '../Image';

const useRetry = (hasError: boolean, retryCount = 5) => {
  // NOTE: Glide(fast-image) will retry automatically on Android
  if (Platform.OS === 'android') return '';

  const forceUpdate = useForceUpdate();
  const retryCountRef = useRef(1);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (hasError) {
      const reloadReservation = () => {
        if (retryCountRef.current < retryCount) {
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            reloadReservation();
            forceUpdate();
          }, retryCountRef.current * 5000);
        }
      };

      return reloadReservation();
    } else {
      return clearTimeout(retryTimeoutRef.current);
    }
  }, [hasError]);

  return retryCountRef.current;
};

type Props = {
  source: number | { uri: string };
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  style?: StyleProp<ViewStyle>;
};
const ImageWithPlaceholder = (props: Props) => {
  const { palette, select, colors } = useUIKitTheme();
  const [imageNotFound, setImageNotFound] = useState(false);

  const key = useRetry(imageNotFound);
  return (
    <Box
      style={[{ overflow: 'hidden', width: props.width, height: props.height }, props.style]}
      backgroundColor={select({ dark: palette.background400, light: palette.background100 })}
    >
      <Image
        key={key}
        source={props.source}
        style={[StyleSheet.absoluteFill, imageNotFound && styles.hide]}
        resizeMode={'cover'}
        resizeMethod={'resize'}
        onError={() => setImageNotFound(true)}
        onLoad={() => setImageNotFound(false)}
      />
      {imageNotFound && (
        <Icon
          containerStyle={StyleSheet.absoluteFill}
          icon={'thumbnail-none'}
          size={48}
          color={colors.onBackground02}
        />
      )}
    </Box>
  );
};

const styles = createStyleSheet({
  hide: {
    display: 'none',
  },
});

export default ImageWithPlaceholder;
