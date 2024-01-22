// @ts-nocheck
import { ChannelType } from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelCollectionEventHandler,
  GroupChannelCollectionParams,
  GroupChannelFilter,
  GroupChannelListOrder,
} from '@sendbird/chat/groupChannel';
import type { SendbirdGroupChannelCollection } from '@sendbird/uikit-utils';

import type { GetMockParams, GetMockProps } from '../types';
import { createTestContext } from '../utils/createTestContext';
import { createMockChannel } from './createMockChannel';

type Params = GetMockParams<GroupChannelCollectionParams & { hasMore: boolean }>;
export const createMockGroupChannelCollection = (params: Params) => {
  return new MockGroupChannelCollection(params);
};

const tc = createTestContext();

class MockGroupChannelCollection implements GetMockProps<Params, SendbirdGroupChannelCollection> {
  constructor(public params: Params) {
    Object.assign(this, params);
  }
  __handlerId?: string;

  channels: GroupChannel[] = [];
  filter: GroupChannelFilter = new GroupChannelFilter();
  order: GroupChannelListOrder = GroupChannelListOrder.LATEST_LAST_MESSAGE;

  dispose = jest.fn(() => {
    if (this.__handlerId && this.params.sdk) {
      delete this.params.sdk.__context.groupChannelCollectionHandlers[this.__handlerId];
    }
  });

  hasMore = true;

  loadMore = jest.fn(async () => {
    const channels = Array(this.params.limit ?? 20)
      .fill(null)
      .map(() => createMockChannel({ sdk: this.params.sdk, channelType: ChannelType.GROUP }).asGroupChannel());

    this.channels = [...this.channels, ...channels];
    return channels;
  });

  setGroupChannelCollectionHandler = jest.fn((handler: GroupChannelCollectionEventHandler) => {
    if (this.params.sdk) {
      this.__handlerId = String(tc.getRandom());
      this.params.sdk.__context.groupChannelCollectionHandlers[this.__handlerId] = handler;
    }
  });
}
