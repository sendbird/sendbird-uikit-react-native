import { ChannelType } from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelCollectionEventHandler,
  GroupChannelCollectionParams,
  GroupChannelFilter,
  GroupChannelListOrder,
} from '@sendbird/chat/groupChannel';
import { createMockChannel } from '@sendbird/uikit-testing-tools';
import type { SendbirdGroupChannelCollection } from '@sendbird/uikit-utils';

import type { GetMockParams, GetMockProps } from '../types';

type Params = GetMockParams<GroupChannelCollectionParams>;
export const createMockGroupChannelCollection = (params: Params) => {
  return new MockGroupChannelCollection(params);
};

class MockGroupChannelCollection implements GetMockProps<Params, SendbirdGroupChannelCollection> {
  constructor(public params: Params) {
    Object.assign(this, params);
  }

  channels: GroupChannel[] = [];
  filter: GroupChannelFilter = new GroupChannelFilter();
  order: GroupChannelListOrder = GroupChannelListOrder.LATEST_LAST_MESSAGE;

  dispose = jest.fn();

  get hasMore(): boolean {
    return true;
  }

  loadMore = jest.fn(async () => {
    const channels = Array(this.params.limit ?? 20)
      .fill(null)
      .map(() => createMockChannel({ sdk: this.params.sdk, channelType: ChannelType.GROUP }));

    this.channels = [...this.channels, ...channels];
    return channels;
  });

  setGroupChannelCollectionHandler = jest.fn((handler: GroupChannelCollectionEventHandler) => {
    if (this.params.sdk) {
      const index = this.params.sdk?.__context.groupChannelCollectionHandlers.push(handler) - 1;
      this.dispose = jest.fn(() => {
        delete this.params.sdk?.__context.groupChannelCollectionHandlers[index];
      });
    }
  });
}
