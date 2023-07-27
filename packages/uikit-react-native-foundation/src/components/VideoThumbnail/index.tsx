import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Box from '../Box';
import Icon from '../Icon';
import ImageWithPlaceholder from '../ImageWithPlaceholder';

type Props = {
  videoSource: string;
  fetchThumbnailFromVideoSource: (uri: string) => Promise<{ path: string } | null>;

  style?: StyleProp<ViewStyle>;
  iconSize?: number;
};

export const VideoThumbnail = ({ fetchThumbnailFromVideoSource, style, videoSource, iconSize = 28 }: Props) => {
  const { palette, select } = useUIKitTheme();
  const { thumbnail, loading } = useRetry(() => fetchThumbnailFromVideoSource(videoSource));

  return (
    <Box style={style}>
      {loading ? (
        <Box
          style={StyleSheet.absoluteFill}
          backgroundColor={select({ dark: palette.background400, light: palette.background100 })}
        />
      ) : (
        <ImageWithPlaceholder source={{ uri: thumbnail ?? 'invalid-image' }} style={StyleSheet.absoluteFill} />
      )}

      {(loading || thumbnail !== null) && iconSize > 0 && (
        <Box style={StyleSheet.absoluteFill} alignItems={'center'} justifyContent={'center'}>
          <Icon
            icon={'play'}
            size={iconSize}
            color={palette.onBackgroundLight02}
            containerStyle={[styles.playIcon, { backgroundColor: palette.onBackgroundDark01 }]}
          />
        </Box>
      )}
    </Box>
  );
};

const useRetry = (fetch: () => Promise<{ path: string } | null>, retryCount = 5) => {
  const [state, setState] = useState({ thumbnail: null as null | string, loading: true });
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const fetchThumbnail = useRef(fetch);
  fetchThumbnail.current = fetch;

  useEffect(() => {
    if (!state.thumbnail) {
      const reloadReservation = () => {
        if (retryCountRef.current < retryCount) {
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            reloadReservation();
            fetchThumbnail.current().then((result) => {
              setState({ loading: false, thumbnail: result?.path ?? null });
            });
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

const styles = createStyleSheet({
  playIcon: {
    padding: 10,
    borderRadius: 50,
  },
});
