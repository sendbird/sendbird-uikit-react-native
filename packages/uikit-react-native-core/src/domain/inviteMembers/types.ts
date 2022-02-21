import type React from 'react';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

/** Specific props type for creating header **/
type FragmentHeaderProps<User> = BaseHeaderProps<{
  title: string;
  left: React.ReactElement;
  onPressLeft: () => void;
  right: string;
  onPressRight?: (users: User[]) => void;
}>;
export type InviteMembersProps<User> = {
  Fragment: {
    Header?: null | CommonComponent<FragmentHeaderProps<User>>;
    onPressHeaderLeft: () => void;
    onPressInviteMembers: (users: User[]) => Promise<void>;
  };
  Header: {
    Header?: InviteMembersProps<User>['Fragment']['Header'];
  };
  List: {
    users: User[];
    renderUser: (user: User) => React.ReactElement | null;
    onLoadMore: () => Promise<void>;
    onRefresh?: () => Promise<void>;
    refreshing?: boolean;
  };
};

/**
 * Internal context for InviteMembers
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type InviteMembersContextType<User> = {
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
};
export interface InviteMembersModule<User> {
  Provider: React.FC;
  List: CommonComponent<InviteMembersProps<User>['List']>;
}

export type InviteMembersFragment<User> = React.FC<InviteMembersProps<User>['Fragment']>;
