import { useRef, useState } from 'react';

import { Logger, getVoiceMessageFileObject, matchesOneOf } from '@sendbird/uikit-utils';

import { FileType } from '../platform/types';
import { usePlatformService } from './useContext';

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

const useVoiceMessageInput = (onSend: (voiceFile: FileType, duration: number) => void): VoiceMessageInputResult => {
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
    if (recordingPath.current) return recordingPath.current;

    recordingPath.current = fileService.createRecordFilePath(recorderService.options.extension);
    return recordingPath.current;
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
          // toast
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
          });

          const unsubscribeState = recorderService.addStateListener((state) => {
            switch (state) {
              case 'recording':
                setStatus('recording');
                break;
              case 'completed':
                unsubscribeRecording();
                unsubscribeState();
                setStatus('recording_completed');
                break;
            }
          });

          await recorderService.record(getVoiceMessageRecordingPath().recordFilePath);
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
          // toast
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
              case 'paused':
              case 'stopped':
                setStatus('playing_paused');
                unsubscribeState();
                unsubscribePlayback();
                break;
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
