import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { Box, Icon, PressBox, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { millsToMMSS } from '@sendbird/uikit-utils';

import useVoiceMessageInput from '../../hooks/useVoiceMessageInput';
import type { FileType } from '../../platform/types';

export type VoiceMessageInputProps = {
  onCancel: () => void; // stop playing, recording, hide view
  onSend: (params: { file: FileType; duration: number }) => void;
};

const VoiceMessageInput = ({ onCancel, onSend }: VoiceMessageInputProps) => {
  const { colors, palette, select } = useUIKitTheme();
  const { actions, state } = useVoiceMessageInput((file, duration) => onSend({ file, duration }));

  const onPressCancel = async () => {
    actions.cancel();
    onCancel();
  };

  const onPressSend = async () => {
    actions.send();
    onCancel();
  };

  const onPressVoiceMessageAction = () => {
    switch (state.status) {
      case 'idle':
        actions.startRecording();
        break;
      case 'recording':
        actions.stopRecording();
        break;
      case 'completed':
      case 'paused':
        actions.playPlayer();
        break;
      case 'playing':
        actions.pausePlayer();
        break;
    }
  };
  const renderActionIcon = () => {
    switch (state.status) {
      case 'idle':
        return (
          <Icon icon={'recording'} size={20} color={select({ light: palette.error300, dark: palette.error200 })} />
        );
      case 'recording':
        return <Icon icon={'stop'} size={20} color={colors.onBackground01} />;
      case 'completed':
      case 'paused':
        return <Icon icon={'play'} size={20} color={colors.onBackground01} />;
      case 'playing':
        return <Icon icon={'pause'} size={20} color={colors.onBackground01} />;
    }
  };

  const recordingInActiveStyle = {
    bar: select({ light: palette.background100, dark: palette.background400 }),
    track: select({ light: palette.background100, dark: palette.background400 }),
    overlayText: colors.onBackground01,
    overlayTextOpacity: 0.38,
  };
  const recordingActiveStyle = {
    bar: colors.onBackground01,
    track: colors.primary,
    overlayText: colors.onBackgroundReverse01,
    overlayTextOpacity: 0.88,
  };

  const useRecorderProgress = state.status === 'recording' || state.status === 'completed';
  const recorderStyle = state.status !== 'idle' ? recordingActiveStyle : recordingInActiveStyle;

  return (
    <Box backgroundColor={'white'} paddingVertical={24} paddingHorizontal={16} style={styles.container}>
      {/** Progress bar **/}
      <ProgressBar
        current={useRecorderProgress ? state.recordingTime.currentTime : state.playingTime.currentTime}
        total={useRecorderProgress ? state.recordingTime.maxDuration : state.playingTime.duration || 1}
        barColor={recorderStyle.bar}
        trackColor={recorderStyle.track}
        overlay={
          <Box flex={1} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-end'} paddingRight={16}>
            <RecordingLight visible={state.status === 'recording'} />
            <Text
              caption1
              style={{ lineHeight: 0, marginLeft: 6, opacity: recorderStyle.overlayTextOpacity }}
              color={recorderStyle.overlayText}
            >
              {millsToMMSS(useRecorderProgress ? state.recordingTime.currentTime : state.playingTime.currentTime)}
            </Text>
          </Box>
        }
      />

      <Box height={34} alignItems={'center'} justifyContent={'center'}>
        {/** Cancel / Send **/}
        <Box flexDirection={'row'}>
          <CancelButton label={'Cancel'} onPress={onPressCancel} />
          <Box flex={1} />
          <SendButton
            disabled={state.status === 'idle' || state.recordingTime.currentTime < state.recordingTime.minDuration}
            onPress={onPressSend}
          />
        </Box>

        {/** Record / Play / Pause **/}
        <Box style={{ position: 'absolute' }} alignItems={'center'} justifyContent={'center'}>
          <PressBox activeOpacity={0.5} onPress={onPressVoiceMessageAction}>
            <Box
              width={34}
              height={34}
              borderRadius={17}
              alignItems={'center'}
              justifyContent={'center'}
              backgroundColor={select({ dark: palette.background500, light: palette.background100 })}
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
  const { palette, select } = useUIKitTheme();
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    );

    if (props.visible) animation.start();
    return () => {
      animation.stop();
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
        backgroundColor: select({ light: palette.error300, dark: palette.error200 }),
      }}
    />
  );
};

const ProgressBar = (props: {
  current: number;
  total: number;
  trackColor?: string;
  barColor?: string;
  overlay?: ReactNode | undefined;
}) => {
  const { current = 100, total = 100 } = props;

  const { colors } = useUIKitTheme();

  const uiColors = {
    track: props.trackColor ?? colors.primary,
    bar: props.barColor ?? colors.onBackground01,
  };

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const percent = current / total;
    if (Number.isNaN(current / total)) return;

    const animation = Animated.timing(progress, {
      toValue: percent,
      duration: 100,
      useNativeDriver: false,
      easing: Easing.linear,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [current / total]);

  return (
    <Box
      flexDirection={'row'}
      height={36}
      backgroundColor={uiColors.track}
      alignItems={'center'}
      marginBottom={16}
      borderRadius={18}
      overflow={'hidden'}
    >
      <Animated.View
        style={{
          width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }),
          height: '100%',
          opacity: 0.38,
          backgroundColor: uiColors.bar,
        }}
      />
      <Box style={StyleSheet.absoluteFill}>{props.overlay}</Box>
    </Box>
  );
};

const CancelButton = (props: { onPress: () => void; label: string }) => {
  const { colors } = useUIKitTheme();

  return (
    <PressBox activeOpacity={0.8} onPress={props.onPress}>
      <Box paddingHorizontal={12} height={'100%'} alignItems={'center'} justifyContent={'center'}>
        <Text button color={colors.ui.input.default.active.highlight} numberOfLines={1}>
          {props.label}
        </Text>
      </Box>
    </PressBox>
  );
};

const SendButton = (props: { onPress: () => void; disabled: boolean }) => {
  const { colors, select, palette } = useUIKitTheme();

  const backgroundColor = props.disabled
    ? select({ dark: palette.background500, light: palette.background100 })
    : colors.primary;
  const iconColor = props.disabled ? colors.onBackground04 : colors.onBackgroundReverse01;

  return (
    <PressBox disabled={props.disabled} activeOpacity={0.8} onPress={props.onPress}>
      <Box backgroundColor={backgroundColor} padding={7} borderRadius={40}>
        <Icon icon={'send'} size={20} color={iconColor} />
      </Box>
    </PressBox>
  );
};

const styles = createStyleSheet({
  container: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default VoiceMessageInput;
