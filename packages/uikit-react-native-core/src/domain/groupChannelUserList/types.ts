import type React from 'react';
import type Sendbird from 'sendbird';

import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';

import type { GroupChannelType } from '../groupChannelList/types';
import type { UserListProps } from '../userList/types';

type UserIds = string[];

export type GroupChannelCreateFragment<User> = React.FC<{
  onPressHeaderLeft: () => void;
  onCreateChannel: (channel: Sendbird.GroupChannel) => void;
  channelType?: GroupChannelType;
  userIdsGenerator?: (users: User[]) => UserIds;
  onBeforeCreateChannel?: (
    params: Sendbird.GroupChannelParams,
    users: User[],
  ) => Sendbird.GroupChannelParams | Promise<Sendbird.GroupChannelParams>;
  sortComparator?: UseUserListOptions<User>['sortComparator'];
  queryCreator?: UseUserListOptions<User>['queryCreator'];
  renderUser?: UserListProps<User>['List']['renderUser'];
}>;

export type GroupChannelInviteFragment<User> = React.FC<{
  staleChannel: Sendbird.GroupChannel;
  onPressHeaderLeft: () => void;
  onInviteMembers: (channel: Sendbird.GroupChannel) => void;
  userIdsGenerator?: (users: User[]) => UserIds;
  queryCreator?: UseUserListOptions<User>['queryCreator'];
  renderUser?: UserListProps<User>['List']['renderUser'];
  sortComparator?: UseUserListOptions<User>['sortComparator'];
}>;

export type GroupChannelMembersFragment<User> = React.FC<{
  channel: Sendbird.GroupChannel;
  onPressHeaderLeft: () => void;
  onPressHeaderRight: () => void;
  sortComparator?: UseUserListOptions<User>['sortComparator'];
  renderUser?: UserListProps<User>['List']['renderUser'];
}>;
