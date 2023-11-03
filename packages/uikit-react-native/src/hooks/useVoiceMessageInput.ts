import { useRef, useState } from 'react';

import { useAlert } from '@sendbird/uikit-react-native-foundation';
import { Logger, getVoiceMessageFileObject, matchesOneOf } from '@sendbird/uikit-utils';

import SBUUtils from '../libs/SBUUtils';
import { FileType } from '../platform/types';
import { useLocalization, usePlatformService } from './useContext';

type State = {
  /**
   * Status
   *
   * idle:
   *   - cancel(): idle
   *   - startRecording(): recording
   * recording:
   *   - cancel(): idle
   *   - stopRecording(): recording_completed
   *   - send(): recording_completed > idle
   * recording_completed:
   *   - cancel(): idle
   *   - playPlayer(): playing
   *   - send(): idle
   * playing:
   *   - cancel(): idle
   *   - pausePlayer(): playing_paused
   *   - send(): idle
   * playing_paused:
   *   - cancel(): idle
   *   - playPlayer(): playing
   *   - send(): idle
   * */
  status: 'idle' | 'recording' | 'recording_completed' | 'playing' | 'playing_paused';
  recordingTime: {
    currentTime: number;
    minDuration: number;
    maxDuration: number;
  };
  playingTime: {
    currentTime: number;
    duration: number;
  };
};

export interface VoiceMessageInputResult {
  actions: {
    cancel: () => Promise<void>;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    playPlayer: () => Promise<void>;
    pausePlayer: () => Promise<void>;
    send: () => Promise<void>;
  };
  state: State;
}

type Props = {
  onClose: () => Promise<void>;
  onSend: (voiceFile: FileType, duration: number) => void;
};

const useVoiceMessageInput = ({ onSend, onClose }: Props): VoiceMessageInputResult => {
  const { alert } = useAlert();
  const { STRINGS } = useLocalization();
  const { recorderService, playerService, fileService } = usePlatformService();
  const [status, setStatus] = useState<State['status']>('idle');

  const [recordingTime, setRecordingTime] = useState({
    currentTime: 0,
    minDuration: recorderService.options.minDuration,
    maxDuration: recorderService.options.maxDuration,
  });
  const [playingTime, setPlayingTime] = useState({
    currentTime: 0,
    duration: 0,
  });

  const recordingPath = useRef<{ recordFilePath: string; uri: string }>();
  const getVoiceMessageRecordingPath = () => {
    if (!recordingPath.current) throw new Error('No recording path');
    return recordingPath.current;
  };
  const setVoiceMessageRecordingPath = (path: { recordFilePath: string; uri: string }) => {
    recordingPath.current = path;
  };

  const clear = async () => {
    recordingPath.current = undefined;
    await playerService.reset();
    await recorderService.reset();
    setRecordingTime({
      currentTime: 0,
      minDuration: recorderService.options.minDuration,
      maxDuration: recorderService.options.maxDuration,
    });
    setPlayingTime({
      currentTime: 0,
      duration: 0,
    });
    setStatus('idle');
  };

  return {
    state: {
      status,
      recordingTime,
      playingTime,
    },
    actions: {
      async cancel() {
        await clear();
      },
      async startRecording() {
        const granted = await recorderService.requestPermission();
        if (!granted) {
          await onClose();
          alert({
            title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
            message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
              STRINGS.LABELS.PERMISSION_MICROPHONE,
              STRINGS.LABELS.PERMISSION_APP_NAME,
            ),
            buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
          });
          Logger.error('Failed to request permission for recorder');
          return;
        }

        if (matchesOneOf(status, ['idle'])) {
          // Before start recording, if player is not idle, reset it.
          if (playerService.state !== 'idle') {
            await playerService.reset();
          }

          const unsubscribeRecording = recorderService.addRecordingListener(({ currentTime }) => {
            setRecordingTime({
              currentTime,
              maxDuration: recorderService.options.maxDuration,
              minDuration: recorderService.options.minDuration,
            });
            setPlayingTime((prev) => ({ ...prev, duration: currentTime }));
          });

          const unsubscribeState = recorderService.addStateListener((state) => {
            switch (state) {
              case 'recording':
                setStatus('recording');
                break;
              case 'completed':
                setStatus('recording_completed');
                unsubscribeRecording();
                unsubscribeState();
                break;
            }
          });

          if (SBUUtils.isExpo()) {
            await recorderService.record();
            if (recorderService.uri) {
              setVoiceMessageRecordingPath({ recordFilePath: recorderService.uri, uri: recorderService.uri });
            }
          } else {
            setVoiceMessageRecordingPath(fileService.createRecordFilePath(recorderService.options.extension));
            await recorderService.record(getVoiceMessageRecordingPath().recordFilePath);
          }
        }
      },
      async stopRecording() {
        if (matchesOneOf(status, ['recording'])) {
          await recorderService.stop();
        }
      },
      async playPlayer() {
        const granted = await playerService.requestPermission();
        if (!granted) {
          alert({
            title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
            message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
              STRINGS.LABELS.PERMISSION_DEVICE_STORAGE,
              STRINGS.LABELS.PERMISSION_APP_NAME,
            ),
            buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
          });
          Logger.error('Failed to request permission for player');
          return;
        }

        if (matchesOneOf(status, ['recording_completed', 'playing_paused'])) {
          const unsubscribePlayback = playerService.addPlaybackListener(({ currentTime, duration }) => {
            setPlayingTime({ currentTime, duration });
          });

          const unsubscribeState = playerService.addStateListener((state) => {
            switch (state) {
              case 'playing':
                setStatus('playing');
                break;
              case 'paused': {
                setStatus('playing_paused');
                unsubscribeState();
                unsubscribePlayback();
                break;
              }
              case 'stopped': {
                setStatus('playing_paused');
                unsubscribeState();
                unsubscribePlayback();
                setPlayingTime((prev) => ({ ...prev, currentTime: 0 }));
                break;
              }
            }
          });

          await playerService.play(getVoiceMessageRecordingPath().recordFilePath);
        }
      },
      async pausePlayer() {
        if (matchesOneOf(status, ['playing'])) {
          await playerService.pause();
        }
      },
      async send() {
        if (
          matchesOneOf(status, ['recording', 'recording_completed', 'playing', 'playing_paused']) &&
          recordingPath.current
        ) {
          const voiceFile = getVoiceMessageFileObject(recordingPath.current.uri, recorderService.options.extension);
          onSend(voiceFile, Math.floor(recordingTime.currentTime));
          await clear();
        }
      },
    },
  };
};

export default useVoiceMessageInput;
