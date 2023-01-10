import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { Icon, Image, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { getAvailableUriFromFileMessage } from '@sendbird/uikit-utils';

import { usePlatformService } from '../../../hooks/useContext';
import type { FileMessageProps } from './index';

const useRetry = (videoFileUrl: string, retryCount = 5) => {
  const [state, setState] = useState({ thumbnail: null as null | string, loading: true });
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const { mediaService } = usePlatformService();

  const fetchThumbnail = () => {
    return mediaService.getVideoThumbnail({ url: videoFileUrl, timeMills: 1000 }).then((result) => {
      setState({ loading: false, thumbnail: result?.path ?? null });
    });
  };

  useEffect(() => {
    if (!state.thumbnail) {
      const reloadReservation = () => {
        if (retryCountRef.current < retryCount) {
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            reloadReservation();
            fetchThumbnail();
          }, retryCountRef.current * 5000);
        }
      };

      return reloadReservation();
    } else {
      return clearTimeout(retryTimeoutRef.current);
    }
  }, [state.thumbnail]);

  return state;
};

const VideoFileMessage = ({ message, variant, children }: FileMessageProps) => {
  const { colors } = useUIKitTheme();

  const fileUrl = getAvailableUriFromFileMessage(message);
  const style = [styles.video, { backgroundColor: colors.onBackground04 }];

  const { loading, thumbnail } = useRetry(fileUrl);

  if (loading) {
    return (
      <View style={[styles.bubbleContainer, { backgroundColor: colors.ui.message[variant].enabled.background }]}>
        <View style={[styles.bubbleContainer, styles.bubbleInnerContainer]}>
          <View style={style} />
          <PlayIcon />
        </View>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.bubbleContainer, { backgroundColor: colors.ui.message[variant].enabled.background }]}>
      <View style={[styles.bubbleContainer, styles.bubbleInnerContainer]}>
        <Image source={{ uri: thumbnail || fileUrl }} style={style} resizeMode={'cover'} resizeMethod={'resize'} />
        <PlayIcon />
      </View>
      {children}
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
  bubbleContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  bubbleInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 240,
    maxWidth: 240,
    height: 160,
  },
  playIcon: {
    position: 'absolute',
    padding: 10,
    borderRadius: 50,
  },
});

export default VideoFileMessage;
