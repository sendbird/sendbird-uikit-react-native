import { act, renderHook } from '@testing-library/react-native';

import { MessageType, SendingStatus } from '@sendbird/chat/message';
import { createMockMessage, createMockUser } from '@sendbird/uikit-testing-tools';

import { useChannelMessagesReducer } from '../../channel/useChannelMessagesReducer';

describe('useChannelMessagesReducer', () => {
  const messages = [
    createMockMessage({ messageId: 1, message: 'Hello', sendingStatus: SendingStatus.SUCCEEDED }),
    createMockMessage({ messageId: 2, message: 'World', sendingStatus: SendingStatus.SUCCEEDED }),
  ];
  const messagesToAppend = [
    createMockMessage({ messageId: 3, message: 'Hello', sendingStatus: SendingStatus.SUCCEEDED }),
    createMockMessage({ messageId: 4, message: 'Friends', sendingStatus: SendingStatus.SUCCEEDED }),
  ];

  test('should update loading state', () => {
    const { result } = renderHook(() => useChannelMessagesReducer());
    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.updateLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  test('should update refreshing state', () => {
    const { result } = renderHook(() => useChannelMessagesReducer());
    expect(result.current.refreshing).toBe(false);

    act(() => {
      result.current.updateRefreshing(true);
    });

    expect(result.current.refreshing).toBe(true);
  });

  test('should update messages state', async () => {
    const { result } = renderHook(() => useChannelMessagesReducer());

    expect(result.current.messages).toHaveLength(0);

    act(() => result.current.updateMessages(messages, true));
    expect(result.current.messages).toEqual(messages);

    act(() => result.current.updateMessages(messagesToAppend, false));
    expect(result.current.messages).toEqual([...messages, ...messagesToAppend]);
  });

  test('should delete messages state', () => {
    const { result } = renderHook(() => useChannelMessagesReducer());
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

  test('should update new messages state', () => {
    const userId = 'other-user-id';
    const newMessages = [
      createMockMessage({
        messageId: 1,
        message: 'message1',
        sender: createMockUser({ userId }).asSender(),
        sendingStatus: SendingStatus.SUCCEEDED,
        updatedAt: 0,
      }),
      createMockMessage({
        messageId: 2,
        message: 'message1',
        sender: createMockUser({ userId }).asSender(),
        sendingStatus: SendingStatus.SUCCEEDED,
        updatedAt: 0,
      }),
    ];
    const updatedMessage = createMockMessage({
      messageId: 3,
      message: 'message3',
      sender: createMockUser({ userId }).asSender(),
      sendingStatus: SendingStatus.SUCCEEDED,
      updatedAt: Date.now(),
    });
    const newMessagesToAppend = [
      createMockMessage({
        messageId: 4,
        message: 'message4',
        sender: createMockUser({ userId }).asSender(),
        sendingStatus: SendingStatus.SUCCEEDED,
        updatedAt: 0,
      }),
    ];

    const { result } = renderHook(() => useChannelMessagesReducer());

    expect(result.current.newMessages).toHaveLength(0);

    act(() => result.current.updateNewMessages([...newMessages, updatedMessage], true));
    expect(result.current.newMessages).toEqual(newMessages);

    act(() => result.current.updateNewMessages(newMessagesToAppend, false));
    expect(result.current.newMessages).toEqual([...newMessages, ...newMessagesToAppend]);
  });

  test('should delete new messages state', () => {
    const userId = 'other-user-id';
    const newMessages = [
      createMockMessage({
        messageId: 1,
        message: 'message1',
        sender: createMockUser({ userId }).asSender(),
        sendingStatus: SendingStatus.SUCCEEDED,
        updatedAt: 0,
      }),
      createMockMessage({
        messageId: 2,
        message: 'message2',
        sender: createMockUser({ userId }).asSender(),
        sendingStatus: SendingStatus.SUCCEEDED,
        updatedAt: 0,
      }),
      createMockMessage({
        messageId: 3,
        message: 'message3',
        sender: createMockUser({ userId }).asSender(),
        sendingStatus: SendingStatus.SUCCEEDED,
        updatedAt: 0,
      }),
    ];

    const { result } = renderHook(() => useChannelMessagesReducer());

    act(() => {
      result.current.updateNewMessages(newMessages, true, 'my-user-id');
      result.current.deleteNewMessages([newMessages[1].messageId], []);
    });

    expect(result.current.newMessages).toEqual([newMessages[0], newMessages[2]]);
  });

  test('should update messages sorted by sortComparator', () => {
    const comparator = jest.fn((a, b) => b.createdAt - a.createdAt);
    const { result } = renderHook(() => useChannelMessagesReducer(comparator));
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
    const { result } = renderHook(() => useChannelMessagesReducer());

    act(() => result.current.updateNewMessages(messages, true, MY_USER_ID));

    expect(result.current.newMessages).toHaveLength(1);
    expect(result.current.newMessages[0]).toEqual(messages[messages.length - 1]);
  });

  test('should replace pending messages to succeeded messages', () => {
    const me = createMockUser({ userId: 'sender1' }).asSender();
    const initMessage = createMockMessage({
      reqId: 'req-id-1',
      messageId: 3,
      message: 'World',
      sendingStatus: SendingStatus.SUCCEEDED,
      messageType: MessageType.USER,
    });

    const pendingMessages = [
      createMockMessage({
        reqId: 'req-id-2',
        sender: me,
        message: 'Hello',
        sendingStatus: SendingStatus.PENDING,
        messageType: MessageType.USER,
      }),
      createMockMessage({
        reqId: 'req-id-3',
        sender: me,
        message: 'World',
        sendingStatus: SendingStatus.PENDING,
        messageType: MessageType.USER,
      }),
    ];

    const sentMessages = [
      createMockMessage({
        ...pendingMessages[0],
        sendingStatus: SendingStatus.SUCCEEDED,
      }),
      createMockMessage({
        ...pendingMessages[1],
        sendingStatus: SendingStatus.SUCCEEDED,
      }),
    ];

    const { result } = renderHook(() => useChannelMessagesReducer((a, b) => a.createdAt - b.createdAt));

    act(() => {
      result.current.updateMessages([initMessage], true, me.userId);
    });
    expect(result.current.messages).toHaveLength(1);

    act(() => {
      result.current.updateMessages(pendingMessages, false, me.userId);
    });
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages).toEqual([initMessage, ...pendingMessages]);

    act(() => {
      result.current.updateMessages(sentMessages, false, me.userId);
    });
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages).toEqual([initMessage, ...sentMessages]);
  });

  test('should update succeeded messages with reactions updated', () => {
    const me = createMockUser({ userId: 'sender1' }).asSender();

    const sentMessages = [
      createMockMessage({
        sender: me,
        message: 'Hello',
        sendingStatus: SendingStatus.SUCCEEDED,
        messageType: MessageType.USER,
        createdAt: 1000,
      }),
      createMockMessage({
        sender: me,
        message: 'World',
        sendingStatus: SendingStatus.SUCCEEDED,
        messageType: MessageType.USER,
        createdAt: 1200,
      }),
    ];

    const updatedMessages = [
      createMockMessage({
        ...sentMessages[0],
        reactions: [{ key: 'string', userIds: [], updatedAt: Date.now(), isEmpty: false, applyEvent: jest.fn() }],
      }),
    ];

    const { result } = renderHook(() => useChannelMessagesReducer((a, b) => a.createdAt - b.createdAt));

    act(() => {
      result.current.updateMessages(sentMessages, true, me.userId);
    });
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages).toEqual(sentMessages);

    act(() => {
      result.current.updateMessages(updatedMessages, false, me.userId);
    });
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages).toEqual([updatedMessages[0], sentMessages[1]]);
  });

  test('should update succeeded messages with message updated', () => {
    const me = createMockUser({ userId: 'sender1' }).asSender();

    const sentMessages = [
      createMockMessage({
        sender: me,
        message: 'Hello',
        sendingStatus: SendingStatus.SUCCEEDED,
        messageType: MessageType.USER,
        createdAt: 1000,
      }),
      createMockMessage({
        sender: me,
        message: 'World',
        sendingStatus: SendingStatus.SUCCEEDED,
        messageType: MessageType.USER,
        createdAt: 1200,
      }),
    ];

    const updatedMessages = [
      createMockMessage({
        ...sentMessages[0],
        reqId: 'edited-req-id',
        message: 'Hello (edited)',
        updatedAt: Date.now(),
      }),
    ];

    const { result } = renderHook(() => useChannelMessagesReducer((a, b) => a.createdAt - b.createdAt));

    act(() => {
      result.current.updateMessages(sentMessages, true, me.userId);
    });
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages).toEqual(sentMessages);

    act(() => {
      result.current.updateMessages(updatedMessages, false, me.userId);
    });
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages).toEqual([updatedMessages[0], sentMessages[1]]);
  });

  test('should not update when receiving pending messages that have already been inserted as succeeded', () => {
    const me = createMockUser({ userId: 'sender1' }).asSender();
    const { result } = renderHook(() => useChannelMessagesReducer((a, b) => a.createdAt - b.createdAt));

    const pending = createMockMessage({
      reqId: 'req-id-1',
      message: 'Hello',
      sender: me,
      messageType: MessageType.USER,
      sendingStatus: SendingStatus.PENDING,
    });
    const sent = createMockMessage({
      reqId: 'req-id-1',
      message: 'Hello',
      sender: me,
      messageType: MessageType.USER,
      sendingStatus: SendingStatus.SUCCEEDED,
    });

    act(() => {
      result.current.updateMessages([pending], true, me.userId);
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages).toEqual([pending]);

    act(() => {
      result.current.updateMessages([sent], false, me.userId);
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages).toEqual([sent]);

    act(() => {
      result.current.updateMessages([pending], false, me.userId);
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages).toEqual([sent]);

    act(() => {
      result.current.updateMessages([sent], false, me.userId);
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages).toEqual([sent]);
  });
});
