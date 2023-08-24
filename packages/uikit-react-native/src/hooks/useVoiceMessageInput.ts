import { useRef, useState } from 'react';

import { Logger } from '@sendbird/uikit-utils';

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
   *   - stopRecording(): completed
   *   - send(): completed > idle
   * completed:
   *   - cancel(): idle
   *   - playPlayer(): playing
   *   - send(): idle
   * playing:
   *   - cancel(): idle
   *   - pausePlayer(): paused
   *   - send(): idle
   * paused:
   *   - cancel(): idle
   *   - playPlayer(): playing
   *   - send(): idle
   * */
  status: 'idle' | 'recording' | 'completed' | 'playing' | 'paused';
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

        if (status === 'idle') {
          const { recordFilePath } = getVoiceMessageRecordingPath();
          recorderService.addRecordingListener(({ currentTime, completed }) => {
            setRecordingTime({
              currentTime,
              maxDuration: recorderService.options.maxDuration,
              minDuration: recorderService.options.minDuration,
            });

            if (completed) setStatus('completed');
          });
          playerService.addPlaybackListener(({ currentTime, duration, stopped }) => {
            setPlayingTime({
              currentTime,
              duration,
            });

            if (stopped) setStatus('paused');
          });

          await recorderService.record(recordFilePath);
          setStatus('recording');
        }
      },
      async stopRecording() {
        if (status === 'recording') {
          await recorderService.stop();
          setStatus('completed');
        }
      },
      async playPlayer() {
        const granted = await playerService.requestPermission();
        if (!granted) {
          // toast
          Logger.error('Failed to request permission for player');
          return;
        }

        if (status === 'completed' || status === 'paused') {
          const { recordFilePath } = getVoiceMessageRecordingPath();
          await playerService.play(recordFilePath);
          setStatus('playing');
        }
      },
      async pausePlayer() {
        if (status === 'playing') {
          await playerService.pause();
          setStatus('paused');
        }
      },
      async send() {
        if (status === 'idle') return;

        if (recordingPath.current) {
          // TODO: move to utils/constants
          const voiceFile = {
            uri: recordingPath.current.uri,
            type: 'audio/m4a;sbu_type=voice',
            name: 'Voice_message.m4a',
            size: 0,
          };

          onSend(voiceFile, Math.floor(recordingTime.currentTime));
          await clear();
        }
      },
    },
  };
};

export default useVoiceMessageInput;
