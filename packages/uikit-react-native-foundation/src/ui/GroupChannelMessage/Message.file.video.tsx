import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import { getAvailableUriFromFileMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import ImageWithPlaceholder from '../../components/ImageWithPlaceholder';
import PressBox from '../../components/PressBox';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

type Props = GroupChannelMessageProps<
  SendbirdFileMessage,
  {
    fetchThumbnailFromVideoSource: (uri: string) => Promise<{ path: string } | null>;
  }
>;

const VideoFileMessage = (props: Props) => {
  const { onPress, onLongPress, variant = 'incoming' } = props;

  const { colors, palette, select } = useUIKitTheme();
  const uri = getAvailableUriFromFileMessage(props.message);
  const { thumbnail, loading } = useRetry(() => props.fetchThumbnailFromVideoSource(uri));

  return (
    <MessageContainer {...props}>
      <Box style={styles.container} backgroundColor={colors.ui.groupChannelMessage[variant].enabled.background}>
        <PressBox activeOpacity={0.8} onPress={onPress} onLongPress={onLongPress} style={styles.image}>
          {loading ? (
            <Box
              style={StyleSheet.absoluteFill}
              backgroundColor={select({ dark: palette.background400, light: palette.background100 })}
            />
          ) : (
            <ImageWithPlaceholder source={{ uri: thumbnail ?? 'invalid-image' }} style={StyleSheet.absoluteFill} />
          )}

          {(loading || thumbnail !== null) && (
            <Box style={StyleSheet.absoluteFill} alignItems={'center'} justifyContent={'center'}>
              <Icon
                icon={'play'}
                size={28}
                color={palette.onBackgroundLight02}
                containerStyle={[styles.playIcon, { backgroundColor: palette.onBackgroundDark01 }]}
              />
            </Box>
          )}
        </PressBox>
        {props.children}
      </Box>
    </MessageContainer>
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
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    maxWidth: 240,
    width: 240,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  playIcon: {
    padding: 10,
    borderRadius: 50,
  },
});
export default VideoFileMessage;
