import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Icon, Image, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { getAvailableUriFromFileMessage, useForceUpdate } from '@sendbird/uikit-utils';

import type { FileMessageProps } from './index';

const useRetry = (hasError: boolean, retryCount = 5) => {
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

const ImageFileMessage = ({ message, children, variant }: FileMessageProps) => {
  const { colors } = useUIKitTheme();
  const [imageNotFound, setImageNotFound] = useState(false);

  const fileUrl = getAvailableUriFromFileMessage(message);
  const style = [styles.image, { backgroundColor: colors.onBackground04 }];

  const key = useRetry(imageNotFound);

  return (
    <View
      style={[
        styles.bubbleContainer,
        { backgroundColor: imageNotFound ? colors.onBackground04 : colors.ui.message[variant].enabled.background },
      ]}
    >
      <View style={style}>
        <Image
          key={key}
          source={{ uri: fileUrl }}
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
      </View>
      {children}
    </View>
  );
};

const styles = createStyleSheet({
  bubbleContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: 240,
    maxWidth: 240,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  hide: {
    display: 'none',
  },
});

export default ImageFileMessage;
