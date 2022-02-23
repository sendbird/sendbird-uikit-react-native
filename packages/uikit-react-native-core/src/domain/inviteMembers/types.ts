import type React from 'react';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

/**
 * @type {InviteMembersProps.Fragment} - Props from developer to create fragment
 * @property Fragment.Header - Custom Header for Fragment, Only replace header component not a module
 * @property Fragment.onPressHeaderLeft - Navigate to previous screen
 * @property Fragment.onPressInviteMembers - Method to handle selected invite members. e.g. Create channel with members
 * @property Fragment.queryCreator - Custom Query creator for users query
 *
 * @type {InviteMembersProps.Header} - Props from Fragment for create Header module
 * @property Header.Header - Custom header component from Fragment {@link Fragment.Header}
 * @property Header.onPressHeaderLeft - Method from Fragment {@link Fragment.onPressHeaderLeft}
 * @property Header.onPressInviteMembers - Method from Fragment {@link Fragment.onPressInviteMembers}
 *
 * @type {InviteMembersProps.List} - Props from Fragment for create List module
 * @property List.users - Users from SendbirdChat SDK or Custom query {@link Fragment.queryCreator}
 * @property List.renderUser - Method to render User preview
 * @property List.onLoadMore - Method to load more data, called with onEndReached of FlatList
 * @property List.onRefresh - Method to refresh Users
 * @property List.refreshing - State of refreshing
 * */
export type InviteMembersProps<User> = {
  Fragment: {
    Header?: null | CommonComponent<
      BaseHeaderProps<{
        title: string;
        right: React.ReactElement;
        onPressRight?: () => void;
        left: React.ReactElement;
        onPressLeft: () => void;
      }>
    >;
    onPressHeaderLeft: () => void;
    onPressInviteMembers: (users: User[]) => Promise<void>;
  };
  Header: {
    Header?: InviteMembersProps<User>['Fragment']['Header'];
    onPressHeaderLeft: InviteMembersProps<User>['Fragment']['onPressHeaderLeft'];
    onPressInviteMembers: InviteMembersProps<User>['Fragment']['onPressInviteMembers'];
  };
  List: {
    users: User[];
    renderUser: (user: User) => React.ReactElement | null;
    onLoadNext: () => Promise<void>;
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
  fragment: { headerTitle: string; headerRight: string };
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
};
export interface InviteMembersModule<User> {
  Provider: React.FC;
  Header: CommonComponent<InviteMembersProps<User>['Header']>;
  List: CommonComponent<InviteMembersProps<User>['List']>;
}

export type InviteMembersFragment<User> = React.FC<InviteMembersProps<User>['Fragment']>;
