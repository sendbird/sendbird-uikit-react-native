import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdMember, SendbirdOpenChannel, UserStruct } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';
import type { UserListProps } from '../userList/types';

export interface OpenChannelParticipantsProps<User extends UserStruct> {
  Fragment: {
    channel: SendbirdOpenChannel;
    onPressHeaderLeft: () => void;
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
}
export type OpenChannelParticipantsFragment<User extends UserStruct> = CommonComponent<
  OpenChannelParticipantsProps<User>['Fragment']
>;

export interface OpenChannelRegisterOperatorProps<User extends UserStruct = SendbirdMember> {
  Fragment: {
    channel: SendbirdOpenChannel;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: (channel: SendbirdOpenChannel) => void;
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
}
export type OpenChannelRegisterOperatorFragment<User extends UserStruct> = CommonComponent<
  OpenChannelRegisterOperatorProps<User>['Fragment']
>;
