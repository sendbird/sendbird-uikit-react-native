import type React from 'react';
import type Sendbird from 'sendbird';

import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';
import type { GroupChannelType } from '../groupChannelList/types';
import type { UserListProps } from '../userList/types';

type UserIds = string[];

export type GroupChannelCreateFragment<User> = React.FC<{
  onPressHeaderLeft: () => void;
  onCreateChannel: (channel: Sendbird.GroupChannel) => void;
  Header?: null | CommonComponent<
    BaseHeaderProps<{
      title: string;
      right: React.ReactElement;
      onPressRight?: () => void;
      left: React.ReactElement;
      onPressLeft: () => void;
    }>
  >;
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
  Header?: null | CommonComponent<
    BaseHeaderProps<{
      title: string;
      right: React.ReactElement;
      onPressRight?: () => void;
      left: React.ReactElement;
      onPressLeft: () => void;
    }>
  >;
  channel: Sendbird.GroupChannel;
  userIdsGenerator?: (users: User[]) => UserIds;
  onPressHeaderLeft: () => void;
  onInviteMembers: (channel: Sendbird.GroupChannel) => void;
  sortComparator?: UseUserListOptions<User>['sortComparator'];
  queryCreator?: UseUserListOptions<User>['queryCreator'];
  renderUser?: UserListProps<User>['List']['renderUser'];
}>;

export type GroupChannelMembersFragment<User> = React.FC<{
  Header?: null | CommonComponent<
    BaseHeaderProps<{
      title: string;
      right: React.ReactElement;
      onPressRight?: () => void;
      left: React.ReactElement;
      onPressLeft: () => void;
    }>
  >;
  channel: Sendbird.GroupChannel;
  onPressHeaderLeft: () => void;
  onPressHeaderRight: () => void;
  sortComparator?: UseUserListOptions<User>['sortComparator'];
  renderUser?: UserListProps<User>['List']['renderUser'];
}>;
