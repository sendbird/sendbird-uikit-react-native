import { useReducer } from 'react';

import type { SendbirdChannel } from '@sendbird/uikit-utils';
import { SendbirdGroupChannel, getGroupChannels } from '@sendbird/uikit-utils';

type Order = 'latest_last_message' | 'chronological' | 'channel_name_alphabetical' | 'metadata_value_alphabetical';

type Action =
  | {
      type: 'update_loading' | 'update_refreshing';
      value: { status: boolean };
    }
  | {
      type: 'update_channels';
      value: { channels: SendbirdChannel[] };
    }
  | {
      type: 'delete_channels';
      value: { channelUrls: string[] };
    }
  | {
      type: 'set_channels';
      value: { channels: SendbirdChannel[]; clearPrev: boolean };
    }
  | {
      type: 'update_order';
      value: { order?: Order };
    };

type State = {
  loading: boolean;
  refreshing: boolean;
  groupChannels: SendbirdGroupChannel[];
  order?: Order;
};

const defaultReducer = ({ ...draft }: State, action: Action) => {
  const compareByOrder = createCompareByOrder(draft.order);

  switch (action.type) {
    case 'update_refreshing':
    case 'update_loading': {
      const key = action.type === 'update_loading' ? 'loading' : 'refreshing';
      draft[key] = action.value.status;
      break;
    }
    case 'update_channels': {
      getGroupChannels(action.value.channels).forEach((freshChannel) => {
        const idx = draft.groupChannels.findIndex((staleChannel) => staleChannel.url === freshChannel.url);
        if (idx > -1) draft.groupChannels[idx] = freshChannel;
      });

      compareByOrder && (draft.groupChannels = draft.groupChannels.sort(compareByOrder));
      break;
    }
    case 'delete_channels': {
      action.value.channelUrls.forEach((url) => {
        const idx = draft.groupChannels.findIndex((c) => c.url === url);
        if (idx > -1) draft.groupChannels.splice(idx, 1);
      });

      compareByOrder && (draft.groupChannels = draft.groupChannels.sort(compareByOrder));
      break;
    }
    case 'set_channels': {
      if (action.value.clearPrev) {
        draft.groupChannels = getGroupChannels(action.value.channels);
      } else {
        draft.groupChannels = [...draft.groupChannels, ...getGroupChannels(action.value.channels)];
      }

      compareByOrder && (draft.groupChannels = draft.groupChannels.sort(compareByOrder));
      break;
    }
    case 'update_order': {
      draft.order = action.value.order;
      break;
    }
  }
  return draft;
};

export const useGroupChannelListReducer = (order?: Order) => {
  const [{ loading, refreshing, groupChannels }, dispatch] = useReducer(defaultReducer, {
    loading: true,
    refreshing: false,
    groupChannels: [],
    order,
  });

  const updateChannels = (channels: SendbirdChannel[]) => {
    dispatch({ type: 'update_channels', value: { channels } });
  };
  const deleteChannels = (channelUrls: string[]) => {
    dispatch({ type: 'delete_channels', value: { channelUrls } });
  };
  const setChannels = (channels: SendbirdChannel[], clearPrev: boolean) => {
    dispatch({ type: 'set_channels', value: { channels, clearPrev } });
  };
  const updateLoading = (status: boolean) => {
    dispatch({ type: 'update_loading', value: { status } });
  };
  const updateRefreshing = (status: boolean) => {
    dispatch({ type: 'update_refreshing', value: { status } });
  };
  const updateOrder = (order?: Order) => {
    dispatch({ type: 'update_order', value: { order } });
  };

  return {
    updateLoading,
    updateRefreshing,
    updateChannels,
    deleteChannels,
    setChannels,

    updateOrder,

    loading,
    refreshing,
    groupChannels,
  };
};

const createCompareByOrder = (order?: Order) => {
  if (!order) return undefined;

  return (channel1: SendbirdGroupChannel, channel2: SendbirdGroupChannel): number => {
    switch (order) {
      case 'latest_last_message': {
        if (channel1.lastMessage && channel2.lastMessage) {
          return channel2.lastMessage.createdAt - channel1.lastMessage.createdAt;
        } else if (channel1.lastMessage) {
          return -1;
        } else if (channel2.lastMessage) {
          return 1;
        } else {
          return channel2.createdAt - channel1.createdAt;
        }
      }

      case 'chronological': {
        return channel2.createdAt - channel1.createdAt;
      }

      case 'channel_name_alphabetical': {
        return channel1.name.localeCompare(channel2.name);
      }
      default: {
        return 0;
      }
    }
  };
};
