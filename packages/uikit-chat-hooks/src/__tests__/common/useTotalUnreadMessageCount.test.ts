import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useTotalUnreadMessageCount } from '../../common/useTotalUnreadMessageCount';

describe('useTotalUnreadMessageCount', () => {
  it('should return total unread message count', async () => {
    const sdk = createMockSendbirdChat();
    sdk.groupChannel.getTotalUnreadMessageCount = jest.fn().mockResolvedValue(2);

    const { result } = renderHook(() => useTotalUnreadMessageCount(sdk));

    expect(result.current).toBe('0');

    await waitFor(() => {
      expect(result.current).toBe('2');
      expect(sdk.groupChannel.getTotalUnreadMessageCount).toHaveBeenCalledTimes(1);
    });
  });

  it('should truncates the result if maxCount is provided', async () => {
    const sdk = createMockSendbirdChat();
    sdk.groupChannel.getTotalUnreadMessageCount = jest.fn().mockResolvedValue(10);

    const { result } = renderHook(() => useTotalUnreadMessageCount(sdk, { maxCount: 3 }));

    expect(result.current).toBe('0');

    await waitFor(() => {
      expect(result.current).toBe('3+');
      expect(sdk.groupChannel.getTotalUnreadMessageCount).toHaveBeenCalledTimes(1);
    });
  });

  it('should update total unread message count when onTotalUnreadMessageCountUpdated event received', async () => {
    const sdk = createMockSendbirdChat();
    sdk.groupChannel.getTotalUnreadMessageCount = jest.fn().mockResolvedValue(10);

    const { result } = renderHook(() => useTotalUnreadMessageCount(sdk));

    expect(result.current).toBe('0');
    await waitFor(() => {
      expect(result.current).toBe('10');
      expect(sdk.groupChannel.getTotalUnreadMessageCount).toHaveBeenCalledTimes(1);
    });

    act(() => {
      sdk.__emit('userEvent', 'onTotalUnreadMessageCountUpdated', 20);
    });
    await waitFor(() => {
      expect(result.current).toBe('20');
    });
  });
});
