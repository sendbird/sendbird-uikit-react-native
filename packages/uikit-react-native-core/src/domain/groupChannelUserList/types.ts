import type React from 'react';

import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdGroupChannel, SendbirdGroupChannelParams } from '@sendbird/uikit-utils';

import type { GroupChannelType } from '../groupChannelList/types';
import type { UserListProps } from '../userList/types';

type UserIds = string[];

export type GroupChannelCreateFragment<User> = React.FC<{
  onPressHeaderLeft: () => void;
  onCreateChannel: (channel: SendbirdGroupChannel) => void;
  channelType?: GroupChannelType;
  userIdsGenerator?: (users: User[]) => UserIds;
  onBeforeCreateChannel?: (
    params: SendbirdGroupChannelParams,
    users: User[],
  ) => SendbirdGroupChannelParams | Promise<SendbirdGroupChannelParams>;
  sortComparator?: UseUserListOptions<User>['sortComparator'];
  queryCreator?: UseUserListOptions<User>['queryCreator'];
  renderUser?: UserListProps<User>['List']['renderUser'];
}>;

export type GroupChannelInviteFragment<User> = React.FC<{
  staleChannel: SendbirdGroupChannel;
  onPressHeaderLeft: () => void;
  onInviteMembers: (channel: SendbirdGroupChannel) => void;
  userIdsGenerator?: (users: User[]) => UserIds;
  queryCreator?: UseUserListOptions<User>['queryCreator'];
  renderUser?: UserListProps<User>['List']['renderUser'];
  sortComparator?: UseUserListOptions<User>['sortComparator'];
}>;

export type GroupChannelMembersFragment<User> = React.FC<{
  channel: SendbirdGroupChannel;
  onPressHeaderLeft: () => void;
  onPressHeaderRight: () => void;
  sortComparator?: UseUserListOptions<User>['sortComparator'];
  renderUser?: UserListProps<User>['List']['renderUser'];
}>;
