import { createMockChannel } from './createMockChannel';
import { createMockMessage } from './createMockMessage';
import { createMockUser } from './createMockUser';

type QueryType = 'message' | 'channel' | 'user';
type QueryParams = {
  type: QueryType;
  limit?: number;
  dataLength?: number;
};

const dataListFactory = (type: QueryType = 'message', dataLength = 100) => {
  return Array(dataLength)
    .fill(0)
    .map(() => {
      switch (type) {
        case 'message':
          return createMockMessage({});
        case 'channel':
          return createMockChannel({});
        case 'user':
          return createMockUser({});
      }
    });
};

export const createMockQuery = <T>(params: QueryParams) => {
  const context = {
    data: dataListFactory(params.type, params.dataLength) as T[],
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
