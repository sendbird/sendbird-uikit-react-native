// @ts-nocheck
import { ChannelType } from '@sendbird/chat';

import type { GetMockParams } from '../types';
import { createMockChannel } from './createMockChannel';
import { createMockMessage } from './createMockMessage';
import type { MockSendbirdChatSDK } from './createMockSendbirdSDK';
import { createMockUser } from './createMockUser';

type QueryType = 'message' | 'user' | 'openChannel' | 'groupChannel';
type Params = GetMockParams<{ type: QueryType; dataLength?: number; limit?: number }>;

const dataListFactory = (type: QueryType = 'message', dataLength = 100, sdk?: MockSendbirdChatSDK) => {
  return Array(dataLength)
    .fill(0)
    .map(() => {
      switch (type) {
        case 'message':
          return createMockMessage({ sdk });
        case 'openChannel':
          return createMockChannel({ sdk, channelType: ChannelType.OPEN });
        case 'groupChannel':
          return createMockChannel({ sdk, channelType: ChannelType.GROUP });
        case 'user':
          return createMockUser({ sdk });
      }
    });
};

export const createMockQuery = <T>(params: Params) => {
  const context = {
    data: dataListFactory(params.type, params.dataLength, params.sdk) as T[],
    limit: params.limit || 10,
    cursor: 0,
    loading: false,
  };

  return {
    get context() {
      return context;
    },
    get limit() {
      return context.limit;
    },
    get isLoading() {
      return context.loading;
    },
    get hasNext() {
      const startIdx = context.cursor * context.limit;
      const endIdx = startIdx + context.limit;

      return endIdx < context.data.length;
    },
    next: jest.fn(async () => {
      context.loading = true;

      const startIdx = context.cursor * context.limit;
      const endIdx = startIdx + context.limit;

      context.cursor += 1;
      context.loading = false;

      return context.data.slice(startIdx, endIdx);
    }),
  };
};
