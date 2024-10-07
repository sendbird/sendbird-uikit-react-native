import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import {
  Box,
  Icon,
  PressBox,
  ProgressBar,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { Logger, conditionChaining, millsToMMSS } from '@sendbird/uikit-utils';

import { useLocalization } from '../../hooks/useContext';
import useVoiceMessageInput from '../../hooks/useVoiceMessageInput';
import type { FileType } from '../../platform/types';

export type VoiceMessageInputProps = {
  onClose: () => Promise<void>;
  onSend: (params: { file: FileType; duration: number }) => void;
};

const VoiceMessageInput = ({ onClose, onSend }: VoiceMessageInputProps) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const { actions, state } = useVoiceMessageInput({
    onSend: (file, duration) => onSend({ file, duration }),
    onClose,
  });

  const uiColors = colors.ui.voiceMessageInput.default[state.status !== 'idle' ? 'active' : 'inactive'];

  const onPressCancel = async () => {
    await actions
      .cancel()
      .catch((error) => {
        Logger.warn('Failed to cancel voice message input', error);
      })
      .finally(() => {
        onClose();
      });
  };

  const onPressSend = async () => {
    await actions
      .send()
      .catch((error) => {
        Logger.warn('Failed to send voice message', error);
      })
      .finally(() => {
        onClose();
      });
  };

  const onPressVoiceMessageAction = async () => {
    try {
      switch (state.status) {
        case 'idle':
          await actions.startRecording();
          break;
        case 'recording':
          if (lessThanMinimumDuration) {
            await actions.cancel();
          } else {
            await actions.stopRecording();
          }
          break;
        case 'recording_completed':
        case 'playing_paused':
          await actions.playPlayer();
          break;
        case 'playing':
          await actions.pausePlayer();
          break;
      }
    } catch (error) {
      Logger.warn('Failed to run voice message action.', state);
    }
  };
  const renderActionIcon = () => {
    switch (state.status) {
      case 'idle':
        return <Icon icon={'recording'} size={20} color={uiColors.recording} />;
      case 'recording':
        return <Icon icon={'stop'} size={20} color={uiColors.actionIcon} />;
      case 'recording_completed':
      case 'playing_paused':
        return <Icon icon={'play'} size={20} color={uiColors.actionIcon} />;
      case 'playing':
        return <Icon icon={'pause'} size={20} color={uiColors.actionIcon} />;
    }
  };

  const isRecorderState = state.status === 'recording' || state.status === 'recording_completed';
  const lessThanMinimumDuration = state.recordingTime.currentTime < state.recordingTime.minDuration;
  const remainingTime = state.playingTime.duration - state.playingTime.currentTime;

  return (
    <Box backgroundColor={uiColors.background} paddingVertical={24} paddingHorizontal={16} style={styles.container}>
      {/** Progress bar **/}
      <ProgressBar
        style={styles.progressBar}
        current={conditionChaining(
          [state.status === 'recording', state.status === 'recording_completed'],
          [state.recordingTime.currentTime, 0, state.playingTime.currentTime],
        )}
        total={(isRecorderState ? state.recordingTime.maxDuration : state.playingTime.duration) || 1}
        trackColor={uiColors.progressTrack}
        overlay={
          <Box flex={1} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-end'} paddingRight={16}>
            <RecordingLight visible={state.status === 'recording'} />
            <Text caption1 style={{ lineHeight: undefined, marginLeft: 6 }} color={uiColors.textTime}>
              {millsToMMSS(isRecorderState ? state.recordingTime.currentTime : remainingTime)}
            </Text>
          </Box>
        }
      />

      <Box height={34} alignItems={'center'} justifyContent={'center'}>
        {/** Cancel / Send **/}
        <Box flexDirection={'row'}>
          <CancelButton label={STRINGS.LABELS.VOICE_MESSAGE_INPUT_CANCEL} onPress={onPressCancel} />
          <Box flex={1} />
          <SendButton disabled={state.status === 'idle' || lessThanMinimumDuration} onPress={onPressSend} />
        </Box>

        {/** Record / Stop / Play / Pause **/}
        <Box style={{ position: 'absolute' }} alignItems={'center'} justifyContent={'center'}>
          <PressBox activeOpacity={0.5} onPress={onPressVoiceMessageAction}>
            <Box
              width={34}
              height={34}
              borderRadius={17}
              alignItems={'center'}
              justifyContent={'center'}
              backgroundColor={uiColors.actionIconBackground}
            >
              {renderActionIcon()}
            </Box>
          </PressBox>
        </Box>
      </Box>
    </Box>
  );
};

const RecordingLight = (props: { visible: boolean }) => {
  const { colors } = useUIKitTheme();

  const value = useRef(new Animated.Value(0)).current;
  const animation = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ),
  ).current;

  useEffect(() => {
    if (props.visible) animation.start();
    return () => {
      animation.reset();
    };
  }, [props.visible]);

  if (!props.visible) return null;
  return (
    <Animated.View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        opacity: value,
        backgroundColor: colors.ui.voiceMessageInput.default.active.recording,
      }}
    />
  );
};

const CancelButton = (props: { onPress: () => void; label: string }) => {
  const { colors } = useUIKitTheme();

  return (
    <PressBox activeOpacity={0.8} onPress={props.onPress}>
      <Box paddingHorizontal={12} height={'100%'} alignItems={'center'} justifyContent={'center'}>
        <Text button color={colors.ui.voiceMessageInput.default.active.textCancel} numberOfLines={1}>
          {props.label}
        </Text>
      </Box>
    </PressBox>
  );
};

const SendButton = (props: { onPress: () => void; disabled: boolean }) => {
  const { colors } = useUIKitTheme();

  const uiColors = colors.ui.voiceMessageInput.default[props.disabled ? 'inactive' : 'active'];

  return (
    <PressBox disabled={props.disabled} activeOpacity={0.8} onPress={props.onPress}>
      <Box backgroundColor={uiColors.sendIconBackground} padding={7} borderRadius={40}>
        <Icon icon={'send'} size={20} color={uiColors.sendIcon} />
      </Box>
    </PressBox>
  );
};

const styles = createStyleSheet({
  container: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  progressBar: {
    height: 36,
    marginBottom: 16,
    borderRadius: 18,
  },
});

export default VoiceMessageInput;
