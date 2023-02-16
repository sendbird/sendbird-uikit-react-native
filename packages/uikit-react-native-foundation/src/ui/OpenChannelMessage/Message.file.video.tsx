import React, { useEffect, useRef, useState } from 'react';

import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import { getAvailableUriFromFileMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import ImageWithPlaceholder from '../../components/ImageWithPlaceholder';
import PressBox from '../../components/PressBox';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { OpenChannelMessageProps } from './index';

type Props = {
  fetchThumbnailFromVideoSource: (uri: string) => Promise<{ path: string } | null>;
};
const VideoFileMessage = (props: OpenChannelMessageProps<SendbirdFileMessage, Props>) => {
  const { colors, palette } = useUIKitTheme();
  const { onPress, onLongPress, ...rest } = props;
  const uri = getAvailableUriFromFileMessage(props.message);
  const { thumbnail, loading } = useRetry(() => props.fetchThumbnailFromVideoSource(uri));

  return (
    <MessageContainer {...rest}>
      <PressBox style={styles.container} activeOpacity={0.8} onPress={onPress} onLongPress={onLongPress}>
        <Box borderRadius={8} overflow={'hidden'} style={styles.container}>
          {loading ? (
            <Box backgroundColor={colors.onBackground04} style={{ width: '100%', height: '100%' }} />
          ) : (
            <ImageWithPlaceholder source={{ uri: thumbnail ?? 'invalid-image' }} width={'100%'} height={'100%'} />
          )}

          {(loading || thumbnail !== null) && (
            <Box style={styles.iconContainer} alignItems={'center'} justifyContent={'center'}>
              <Icon
                icon={'play'}
                size={28}
                color={palette.onBackgroundLight02}
                containerStyle={[styles.playIcon, { backgroundColor: palette.onBackgroundDark01 }]}
              />
            </Box>
          )}
        </Box>
      </PressBox>
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
    maxWidth: 296,
    height: 196,
  },
  iconContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  playIcon: {
    padding: 10,
    borderRadius: 50,
  },
});
export default VideoFileMessage;
