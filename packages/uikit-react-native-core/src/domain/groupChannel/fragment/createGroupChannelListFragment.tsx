import React from 'react';

import { useGroupChannelList } from '@sendbird/chat-react-hooks';

import { useSendbirdChat } from '../../../context/SendbirdChat';
import type { GroupChannelListFragment, GroupChannelListModule } from '../../../types';
import createGroupChannelListModule from '../module/createGroupChannelListModule';

const createGroupChannelListFragment = (initModule?: GroupChannelListModule): GroupChannelListFragment => {
  const module = createGroupChannelListModule(initModule);

  const GroupChannelListFragment: GroupChannelListFragment = () => {
    const { sdk, userId } = useSendbirdChat();
    useGroupChannelList(sdk, userId);

    return (
      <>
        {module.Header({})}
        {module.List({})}
      </>
    );
  };

  GroupChannelListFragment.List = module.List;
  GroupChannelListFragment.Header = module.Header;

  return GroupChannelListFragment;
};

export default createGroupChannelListFragment;
