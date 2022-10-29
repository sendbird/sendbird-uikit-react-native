import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdGroupChannel, SendbirdGroupChannelCreateParams, SendbirdMember } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';
import type { GroupChannelType } from '../groupChannelList/types';
import type { UserListProps } from '../userList/types';

type UserIds = string[];

export interface GroupChannelCreateProps<User> {
  Fragment: {
    onPressHeaderLeft: () => void;
    onCreateChannel: (channel: SendbirdGroupChannel) => void;
    channelType?: GroupChannelType;
    userIdsGenerator?: (users: User[]) => UserIds;
    onBeforeCreateChannel?: (
      params: SendbirdGroupChannelCreateParams,
      users: User[],
    ) => SendbirdGroupChannelCreateParams | Promise<SendbirdGroupChannelCreateParams>;
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    queryCreator?: UseUserListOptions<User>['queryCreator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
}
export type GroupChannelCreateFragment<User> = CommonComponent<GroupChannelCreateProps<User>['Fragment']>;

export interface GroupChannelInviteProps<User> {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: () => void;
    onInviteMembers: (channel: SendbirdGroupChannel) => void;
    userIdsGenerator?: (users: User[]) => UserIds;
    queryCreator?: UseUserListOptions<User>['queryCreator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
    sortComparator?: UseUserListOptions<User>['sortComparator'];
  };
}
export type GroupChannelInviteFragment<User> = CommonComponent<GroupChannelInviteProps<User>['Fragment']>;

export interface GroupChannelMembersProps<User> {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
}
export type GroupChannelMembersFragment<User> = CommonComponent<GroupChannelMembersProps<User>['Fragment']>;

export interface GroupChannelOperatorsAddProps<User = SendbirdMember> {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: (channel: SendbirdGroupChannel) => void;
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
}
export type GroupChannelOperatorsAddFragment<User> = CommonComponent<GroupChannelOperatorsAddProps<User>['Fragment']>;
