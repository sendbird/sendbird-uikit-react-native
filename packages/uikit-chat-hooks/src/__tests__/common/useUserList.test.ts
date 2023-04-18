import { act, renderHook, waitFor } from '@testing-library/react-native';

import type { CustomQueryInterface } from '@sendbird/uikit-chat-hooks';
import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';
import { NOOP } from '@sendbird/uikit-utils';

import { useUserList } from '../../common/useUserList';

describe('useUserList', () => {
  it('should return the initial state', async () => {
    const sdk = createMockSendbirdChat();
    const { result } = renderHook(() => useUserList(sdk));
    expect(result.current.loading).toBe(true);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.users).toEqual([]);
    expect(result.current.upsertUser).toBeInstanceOf(Function);
    expect(result.current.deleteUser).toBeInstanceOf(Function);
    expect(result.current.next).toBeInstanceOf(Function);
    expect(result.current.refresh).toBeInstanceOf(Function);
    await waitFor(NOOP);
  });

  it('should fetch users from SDK', async () => {
    const sdk = createMockSendbirdChat();
    const { result } = renderHook(() => useUserList(sdk));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.users).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.users).not.toEqual([]);
      expect(sdk.createApplicationUserListQuery).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle errors from SDK', async () => {
    const sdk = createMockSendbirdChat();

    const query = { hasNext: true, next: jest.fn().mockRejectedValue(new Error('Failed to fetch users')) };
    sdk.createApplicationUserListQuery = jest.fn().mockReturnValue(query);

    const { result } = renderHook(() => useUserList(sdk));
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.users).toEqual([]);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(new Error('Failed to fetch users'));
      expect(result.current.users).toEqual([]);
      expect(query.next).toHaveBeenCalledTimes(1);
    });
  });

  it('should call custom queryCreator', async () => {
    const sdk = createMockSendbirdChat();

    const users = [{ userId: 'user1' }, { userId: 'user2' }];
    const query = { hasNext: true, next: jest.fn().mockResolvedValue(users) };
    const queryCreator = jest.fn().mockReturnValue(query);

    const { result } = renderHook(() => useUserList(sdk, { queryCreator }));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.users).toEqual([]);
    expect(queryCreator).toHaveBeenCalledTimes(1);
    expect(query.next).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.users).toEqual(users);
    });
  });

  test('should sort user list', async () => {
    const sdk = createMockSendbirdChat();

    const users = [
      { userId: 'user1', nickname: 'Alice' },
      { userId: 'user2', nickname: 'Bob' },
    ];
    const query = { hasNext: true, next: jest.fn().mockResolvedValue(users) };
    const queryCreator: () => CustomQueryInterface<(typeof users)[0]> = jest.fn().mockReturnValue(query);

    const { result } = renderHook(() => {
      return useUserList(sdk, {
        queryCreator,
        sortComparator: (a, b) => b.nickname.localeCompare(a.nickname),
      });
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.users).toEqual([
        { userId: 'user2', nickname: 'Bob' },
        { userId: 'user1', nickname: 'Alice' },
      ]);
    });
  });

  test('should handle refresh', async () => {
    const sdk = createMockSendbirdChat();
    const { result } = renderHook(() =>
      useUserList(sdk, {
        queryCreator: () => sdk.createApplicationUserListQuery({ limit: 10 }),
      }),
    );
    await waitFor(NOOP);

    act(() => {
      result.current.next();
    });
    await waitFor(() => {
      expect(result.current.users).toHaveLength(20);
      expect(result.current.refreshing).toBe(false);
    });

    act(() => {
      result.current.refresh();
    });
    expect(result.current.users).toHaveLength(20);
    expect(result.current.refreshing).toBe(true);

    await waitFor(() => {
      expect(result.current.users).toHaveLength(10);
      expect(result.current.refreshing).toBe(false);
    });
  });

  test('should update or insert user', async () => {
    const sdk = createMockSendbirdChat();

    const queryCreator: () => CustomQueryInterface<{ userId: string; nickname: string }> = jest
      .fn()
      .mockReturnValue({ hasNext: false, next: jest.fn(async () => []) });
    const { result } = renderHook(() => useUserList(sdk, { queryCreator }));
    await waitFor(NOOP);

    act(() => {
      result.current.upsertUser({ userId: 'user1', nickname: 'Alice' });
    });
    expect(result.current.users).toEqual([{ userId: 'user1', nickname: 'Alice' }]);

    act(() => {
      result.current.upsertUser({ userId: 'user2', nickname: 'Bob' });
    });
    expect(result.current.users).toEqual([
      { userId: 'user1', nickname: 'Alice' },
      { userId: 'user2', nickname: 'Bob' },
    ]);

    act(() => {
      result.current.upsertUser({ userId: 'user1', nickname: 'Alice2' });
    });
    expect(result.current.users).toEqual([
      { userId: 'user1', nickname: 'Alice2' },
      { userId: 'user2', nickname: 'Bob' },
    ]);
  });

  test('should delete user with user id', async () => {
    const sdk = createMockSendbirdChat();

    const queryCreator: () => CustomQueryInterface<{ userId: string; nickname: string }> = jest.fn().mockReturnValue({
      hasNext: true,
      next: jest.fn(async () => [{ userId: 'user1', nickname: 'Alice' }]),
    });
    const { result } = renderHook(() => useUserList(sdk, { queryCreator }));

    expect(result.current.users).toEqual([]);
    await waitFor(() => {
      expect(result.current.users).toEqual([{ userId: 'user1', nickname: 'Alice' }]);
    });

    act(() => {
      result.current.deleteUser('user1');
    });
    await waitFor(() => {
      expect(result.current.users).toEqual([]);
    });
  });
});
