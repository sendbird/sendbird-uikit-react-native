import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Icon, Image, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { getAvailableUriFromFileMessage } from '@sendbird/uikit-utils';

import { usePlatformService } from '../../../hooks/useContext';
import type { FileMessageProps } from './index';

const VideoFileMessage = ({ message }: FileMessageProps) => {
  const { colors } = useUIKitTheme();

  const { mediaService } = usePlatformService();
  const fileUrl = getAvailableUriFromFileMessage(message);
  const style = [styles.image, { backgroundColor: colors.onBackground04 }];

  const [state, setState] = useState({
    thumbnail: null as null | string,
    loading: true,
    imageNotFound: false,
  });

  useEffect(() => {
    mediaService
      ?.getVideoThumbnail({ url: fileUrl, timeMills: 1000 })
      .then((result) => {
        if (result?.path) {
          setState((prev) => ({ ...prev, loading: false, thumbnail: result.path }));
        } else {
          throw new Error('Cannot generate thumbnail');
        }
      })
      .catch(() => {
        setState((prev) => ({ ...prev, loading: false, imageNotFound: true }));
      });
  }, []);

  if (state.loading || state.imageNotFound) {
    return (
      <View style={[style, styles.container]}>
        <PlayIcon />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: state.thumbnail || fileUrl }}
        style={style}
        resizeMode={'cover'}
        resizeMethod={'resize'}
        onError={() => setState((prev) => ({ ...prev, imageNotFound: true }))}
      />
      <PlayIcon />
    </View>
  );
};

const PlayIcon = () => {
  const { colors } = useUIKitTheme();

  return (
    <Icon
      icon={'play'}
      size={28}
      color={colors.onBackground02}
      containerStyle={[styles.playIcon, { backgroundColor: colors.onBackgroundReverse01 }]}
    />
  );
};

const styles = createStyleSheet({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 240,
    maxWidth: 240,
    height: 160,
    borderRadius: 16,
  },
  playIcon: {
    position: 'absolute',
    padding: 10,
    borderRadius: 50,
  },
});

export default VideoFileMessage;
