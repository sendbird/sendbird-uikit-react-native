import { act, renderHook } from '@testing-library/react-native';

import { MessageType, SendingStatus } from '@sendbird/chat/message';

import { useOpenChannelMessagesReducer } from '../../../channel/useOpenChannelMessages/reducer';
import { createMockMessage } from '../../__mocks__/createMockMessage';
import { createMockUser } from '../../__mocks__/createMockUser';

describe('useOpenChannelMessagesReducer', () => {
  const messages = [
    createMockMessage({ messageId: 1, message: 'Hello', sendingStatus: SendingStatus.SUCCEEDED }),
    createMockMessage({ messageId: 2, message: 'World', sendingStatus: SendingStatus.SUCCEEDED }),
  ];
  const messagesToAppend = [
    createMockMessage({ messageId: 3, message: 'Hello', sendingStatus: SendingStatus.SUCCEEDED }),
    createMockMessage({ messageId: 4, message: 'Friends', sendingStatus: SendingStatus.SUCCEEDED }),
  ];

  test('should update loading state', () => {
    const { result } = renderHook(() => useOpenChannelMessagesReducer());
    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.updateLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  test('should update refreshing state', () => {
    const { result } = renderHook(() => useOpenChannelMessagesReducer());
    expect(result.current.refreshing).toBe(false);

    act(() => {
      result.current.updateRefreshing(true);
    });

    expect(result.current.refreshing).toBe(true);
  });

  test('should update messages state', async () => {
    const { result } = renderHook(() => useOpenChannelMessagesReducer());

    expect(result.current.messages).toHaveLength(0);

    act(() => result.current.updateMessages(messages, true));
    expect(result.current.messages).toEqual(messages);

    act(() => result.current.updateMessages(messagesToAppend, false));
    expect(result.current.messages).toEqual([...messages, ...messagesToAppend]);
  });

  test('should delete messages state', () => {
    const { result } = renderHook(() => useOpenChannelMessagesReducer());
    const messages = [
      createMockMessage({ messageId: 1, message: 'message1', sendingStatus: SendingStatus.SUCCEEDED }),
      createMockMessage({ messageId: 2, message: 'message2', sendingStatus: SendingStatus.SUCCEEDED }),
      createMockMessage({ messageId: 3, message: 'message3', sendingStatus: SendingStatus.SUCCEEDED }),
    ];

    act(() => {
      result.current.updateMessages(messages, true);
      result.current.deleteMessages([messages[1].messageId], []);
    });

    expect(result.current.messages).toEqual([messages[0], messages[2]]);
  });

  test('should update next messages state', () => {
    const { result } = renderHook(() => useOpenChannelMessagesReducer());

    expect(result.current.nextMessages).toHaveLength(0);

    act(() => result.current.updateNextMessages(messages, true));
    expect(result.current.nextMessages).toEqual(messages);

    act(() => result.current.updateNextMessages(messagesToAppend, false));
    expect(result.current.nextMessages).toEqual([...messages, ...messagesToAppend]);
  });

  test('should delete next messages state', () => {
    const { result } = renderHook(() => useOpenChannelMessagesReducer());
    const nextMessages = [
      createMockMessage({ messageId: 1, message: 'message1', sendingStatus: SendingStatus.SUCCEEDED }),
      createMockMessage({ messageId: 2, message: 'message2', sendingStatus: SendingStatus.SUCCEEDED }),
      createMockMessage({ messageId: 3, message: 'message3', sendingStatus: SendingStatus.SUCCEEDED }),
    ];

    act(() => {
      result.current.updateNextMessages(nextMessages, true);
      result.current.deleteNextMessages([nextMessages[1].messageId], []);
    });

    expect(result.current.nextMessages).toEqual([nextMessages[0], nextMessages[2]]);
  });

  test('should update messages sorted by sortComparator', () => {
    const comparator = jest.fn((a, b) => b.createdAt - a.createdAt);
    const { result } = renderHook(() => useOpenChannelMessagesReducer('user-id', comparator));
    const messages = [
      createMockMessage({ messageId: 1, message: 'Hello', sendingStatus: SendingStatus.SUCCEEDED }),
      createMockMessage({ messageId: 2, message: 'World', sendingStatus: SendingStatus.SUCCEEDED }),
    ];

    act(() => {
      result.current.updateMessages(messages, true);
    });

    expect(comparator).toHaveBeenCalled();
    expect(result.current.messages).toEqual(messages.reverse());
  });

  test('should filter new messages from members', () => {
    const MY_USER_ID = 'my-user-id';
    const MEMBER_USER_ID = 'member-user-id';
    const messages = [
      createMockMessage({
        messageId: 1,
        message: 'message1',
        sendingStatus: SendingStatus.SUCCEEDED,
        sender: createMockUser({ userId: MY_USER_ID }).asSender(),
      }),
      createMockMessage({
        messageId: 2,
        message: 'message2',
        sendingStatus: SendingStatus.SUCCEEDED,
        sender: createMockUser({ userId: MEMBER_USER_ID }).asSender(),
        updatedAt: Date.now(),
      }),
      createMockMessage({
        messageId: 3,
        messageType: MessageType.ADMIN,
        message: 'message3',
        sendingStatus: SendingStatus.SUCCEEDED,
        sender: createMockUser({ userId: MEMBER_USER_ID }).asSender(),
        updatedAt: Date.now(),
      }),
      createMockMessage({
        messageId: 4,
        message: 'message4',
        sendingStatus: SendingStatus.SUCCEEDED,
        sender: createMockUser({ userId: MEMBER_USER_ID }).asSender(),
        updatedAt: 0,
      }),
    ];
    const { result } = renderHook(() => useOpenChannelMessagesReducer(MY_USER_ID));

    act(() => result.current.updateNextMessages(messages, true, MY_USER_ID));

    expect(result.current.newMessagesFromMembers).toHaveLength(1);
    expect(result.current.newMessagesFromMembers[0]).toEqual(messages[messages.length - 1]);
  });
});
