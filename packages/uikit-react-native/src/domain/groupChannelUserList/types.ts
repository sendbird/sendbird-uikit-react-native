import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type {
  SendbirdGroupChannel,
  SendbirdGroupChannelCreateParams,
  SendbirdMember,
  UserStruct,
} from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';
import type { GroupChannelType } from '../groupChannelList/types';
import type { UserListProps } from '../userList/types';

export interface GroupChannelCreateProps<User extends UserStruct> {
  Fragment: {
    onPressHeaderLeft: () => void;
    onCreateChannel: (channel: SendbirdGroupChannel) => void;
    channelType?: GroupChannelType;
    onBeforeCreateChannel?: (
      params: SendbirdGroupChannelCreateParams,
      users: User[],
    ) => SendbirdGroupChannelCreateParams | Promise<SendbirdGroupChannelCreateParams>;
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    queryCreator?: UseUserListOptions<User>['queryCreator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
}
export type GroupChannelCreateFragment<User extends UserStruct> = CommonComponent<
  GroupChannelCreateProps<User>['Fragment']
>;

export interface GroupChannelInviteProps<User extends UserStruct> {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: () => void;
    onInviteMembers: (channel: SendbirdGroupChannel) => void;
    queryCreator?: UseUserListOptions<User>['queryCreator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
    sortComparator?: UseUserListOptions<User>['sortComparator'];
  };
}
export type GroupChannelInviteFragment<User extends UserStruct> = CommonComponent<
  GroupChannelInviteProps<User>['Fragment']
>;

export interface GroupChannelMembersProps<User extends UserStruct> {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
}
export type GroupChannelMembersFragment<User extends UserStruct> = CommonComponent<
  GroupChannelMembersProps<User>['Fragment']
>;

export interface GroupChannelRegisterOperatorProps<User extends UserStruct = SendbirdMember> {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: (channel: SendbirdGroupChannel) => void;
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
}
export type GroupChannelRegisterOperatorFragment<User extends UserStruct> = CommonComponent<
  GroupChannelRegisterOperatorProps<User>['Fragment']
>;
