import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { isImage } from '@sendbird/uikit-utils';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Box from '../Box';
import Icon from '../Icon';
import ImageWithPlaceholder from '../ImageWithPlaceholder';

type Props = {
  source: string;
  fetchThumbnailFromVideoSource: (uri: string) => Promise<{ path: string } | null>;

  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  /** @deprecated please use `source` prop **/
  videoSource?: string;
};

export const VideoThumbnail = ({ fetchThumbnailFromVideoSource, style, source, videoSource, iconSize = 28 }: Props) => {
  const { palette, select } = useUIKitTheme();
  const { thumbnail, loading } = useRetry(async () => {
    if (isImage(source ?? videoSource)) return { path: source ?? videoSource };
    return fetchThumbnailFromVideoSource(source ?? videoSource);
  });

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
  const fetchThumbnail = useRef(fetch);
  fetchThumbnail.current = fetch;

  useEffect(() => {
    let _timeout: NodeJS.Timeout;
    let _cancelled = false;

    if (!state.thumbnail) {
      const tryFetchThumbnail = (timeout: number) => {
        const retry = () => {
          retryCountRef.current++;
          tryFetchThumbnail(timeout + 5000);
        };

        const finish = (path: string | null) => {
          if (!_cancelled) setState({ loading: false, thumbnail: path });
        };

        if (retryCountRef.current < retryCount) {
          _timeout = setTimeout(() => {
            fetchThumbnail
              .current()
              .then((result) => {
                if (result === null) retry();
                else finish(result.path);
              })
              .catch(() => retry());
          }, timeout);
        } else {
          finish(null);
        }
      };

      tryFetchThumbnail(0);
    }

    return () => {
      _cancelled = true;
      clearTimeout(_timeout);
    };
  }, [state.thumbnail]);

  return state;
};

const styles = createStyleSheet({
  playIcon: {
    padding: 10,
    borderRadius: 50,
  },
});
