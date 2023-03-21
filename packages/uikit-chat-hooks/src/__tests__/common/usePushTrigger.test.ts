import { act, renderHook, waitFor } from '@testing-library/react-native';

import { PushTriggerOption } from '@sendbird/chat';
import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { usePushTrigger } from '../../common/usePushTrigger';

describe('usePushTrigger', () => {
  it('should return default push trigger option', async () => {
    const sdk = createMockSendbirdChat();

    const { result } = renderHook(() => usePushTrigger(sdk));

    await waitFor(() => {
      expect(sdk.getPushTriggerOption).toHaveBeenCalled();
      expect(result.current.option).toBe(PushTriggerOption.DEFAULT);
    });
  });

  it('should update push trigger option', async () => {
    const sdk = createMockSendbirdChat();

    const { result } = renderHook(() => usePushTrigger(sdk));

    act(() => {
      result.current.updateOption('mention_only');
    });

    await waitFor(() => {
      expect(sdk.setPushTriggerOption).toHaveBeenCalledWith(PushTriggerOption.MENTION_ONLY);
      expect(result.current.option).toBe(PushTriggerOption.MENTION_ONLY);
    });
  });

  it('should retry get push trigger option when sdk changed', async () => {
    let sdk = createMockSendbirdChat({ userId: 'test1', testType: 'success' });

    const { result, rerender } = renderHook(() => usePushTrigger(sdk));

    act(() => {
      result.current.updateOption('mention_only');
    });

    await waitFor(() => {
      expect(sdk.getPushTriggerOption).toHaveBeenCalledTimes(1);
      expect(result.current.option).toBe(PushTriggerOption.MENTION_ONLY);
    });

    act(() => {
      sdk = createMockSendbirdChat({ userId: 'test2', testType: 'success' });
      rerender(sdk);
    });

    await waitFor(() => {
      expect(sdk.getPushTriggerOption).toHaveBeenCalledTimes(1);
      expect(result.current.option).toBe(PushTriggerOption.DEFAULT);
    });
  });
});
