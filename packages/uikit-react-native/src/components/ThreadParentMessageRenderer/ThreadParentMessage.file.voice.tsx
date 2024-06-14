import React, { useEffect, useState } from 'react';

import { Box, Icon, PressBox, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { LoadingSpinner, ProgressBar } from '@sendbird/uikit-react-native-foundation';
import { createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { SendbirdFileMessage, millsToMSS } from '@sendbird/uikit-utils';

import { ThreadParentMessageRendererProps } from './index';

export type VoiceFileMessageState = {
  status: 'preparing' | 'playing' | 'paused';
  currentTime: number;
  duration: number;
};

type Props = ThreadParentMessageRendererProps<{
  durationMetaArrayKey?: string;
  onUnmount: () => void;
}>;

const ThreadParentMessageFileVoice = (props: Props) => {
  const {
    onLongPress,
    onToggleVoiceMessage,
    parentMessage,
    durationMetaArrayKey = 'KEY_VOICE_MESSAGE_DURATION',
    onUnmount,
  } = props;

  const fileMessage: SendbirdFileMessage = parentMessage as SendbirdFileMessage;
  if (!fileMessage) return null;

  const { colors } = useUIKitTheme();

  const [state, setState] = useState<VoiceFileMessageState>(() => {
    const meta = fileMessage.metaArrays.find((it) => it.key === durationMetaArrayKey);
    const value = meta?.value?.[0];
    const initialDuration = value ? parseInt(value, 10) : 0;
    return {
      status: 'paused',
      currentTime: 0,
      duration: initialDuration,
    };
  });

  useEffect(() => {
    return () => {
      onUnmount();
    };
  }, []);

  const uiColors = colors.ui.groupChannelMessage['incoming'];
  const remainingTime = state.duration - state.currentTime;

  return (
    <Box style={styles.container} backgroundColor={uiColors.enabled.background}>
      <PressBox onPress={() => onToggleVoiceMessage?.(state, setState)} onLongPress={onLongPress}>
        <ProgressBar
          current={state.currentTime}
          total={state.duration}
          style={{ minWidth: 136, height: 44 }}
          trackColor={uiColors.enabled.voiceProgressTrack}
          overlay={
            <Box
              flex={1}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              paddingHorizontal={12}
            >
              {state.status === 'preparing' ? (
                <LoadingSpinner size={24} color={uiColors.enabled.voiceSpinner} />
              ) : (
                <Icon
                  size={16}
                  containerStyle={{
                    backgroundColor: uiColors.enabled.voiceActionIconBackground,
                    padding: 6,
                    borderRadius: 16,
                  }}
                  icon={state.status === 'paused' ? 'play' : 'pause'}
                />
              )}
              <Text
                body3
                style={{ lineHeight: undefined, marginLeft: 6, opacity: 0.88 }}
                color={uiColors.enabled.textVoicePlaytime}
              >
                {millsToMSS(state.currentTime === 0 ? state.duration : remainingTime)}
              </Text>
            </Box>
          }
        />
      </PressBox>
    </Box>
  );
};

const styles = createStyleSheet({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    maxWidth: 136,
  },
});

export default ThreadParentMessageFileVoice;
