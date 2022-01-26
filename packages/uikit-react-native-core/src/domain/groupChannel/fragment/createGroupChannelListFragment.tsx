import React from 'react';

import { useGroupChannelList } from '@sendbird/chat-react-hooks';

import { useSendbirdChat } from '../../../context/SendbirdChat';
import createGroupChannelListModule from '../module/createGroupChannelListModule';
import type { GroupChannelListFragment, GroupChannelListModule } from '../types';

const createGroupChannelListFragment = (initModule?: GroupChannelListModule): GroupChannelListFragment => {
  const module = createGroupChannelListModule(initModule);

  const GroupChannelListFragment: GroupChannelListFragment = ({
    left = () => null,
    right = () => null,
    title = 'title',
  }) => {
    const { sdk, userId } = useSendbirdChat();
    useGroupChannelList(sdk, userId);

    return (
      <>
        {module.Header({ left, right, title })}
        {module.List({})}
      </>
    );
  };

  GroupChannelListFragment.List = module.List;
  GroupChannelListFragment.Header = module.Header;

  return GroupChannelListFragment;
};

export default createGroupChannelListFragment;
