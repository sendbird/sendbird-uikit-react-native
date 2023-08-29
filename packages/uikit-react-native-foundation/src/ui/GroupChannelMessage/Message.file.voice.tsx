import React, { useState } from 'react';

import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import { millsToMMSS } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import PressBox from '../../components/PressBox';
import ProgressBar from '../../components/ProgressBar';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import LoadingSpinner from '../LoadingSpinner';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

export type VoiceFileMessageState = {
  status: 'preparing' | 'playing' | 'paused';
  currentTime: number;
  duration: number;
};

type Props = GroupChannelMessageProps<
  SendbirdFileMessage,
  {
    durationMetaArrayKey?: string;
  }
>;
const VoiceFileMessage = (props: Props) => {
  const {
    onLongPress,
    variant = 'incoming',
    onToggleVoiceMessage,
    message,
    durationMetaArrayKey = 'KEY_VOICE_MESSAGE_DURATION',
  } = props;

  const { colors } = useUIKitTheme();

  const [state, setState] = useState<VoiceFileMessageState>(() => {
    const meta = message.metaArrays.find((it) => it.key === durationMetaArrayKey);
    const value = meta?.value?.[0];
    const initialDuration = value ? parseInt(value, 10) : 0;
    return {
      status: 'paused',
      currentTime: 0,
      duration: initialDuration,
    };
  });

  const uiColors = colors.ui.groupChannelMessage[variant];

  return (
    <MessageContainer {...props}>
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
                  color={uiColors.enabled.voiceTextTime}
                >
                  {millsToMMSS(state.currentTime === 0 ? state.duration : state.currentTime)}
                </Text>
              </Box>
            }
          />
        </PressBox>
        {props.children}
      </Box>
    </MessageContainer>
  );
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
});

export default VoiceFileMessage;
