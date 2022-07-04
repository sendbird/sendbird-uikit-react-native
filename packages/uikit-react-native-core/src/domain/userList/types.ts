import type React from 'react';

import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';
import type { ContextValue } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

/**
 * @type {UserListProps.Fragment} - Props from developer to create fragment
 * @property Fragment.Header - Custom Header for Fragment, Only replace header component not a module
 * @property Fragment.onPressHeaderLeft - Navigate to previous screen
 * @property Fragment.onPressHeaderRight - Method to handle selected members. e.g. Create channel with members
 * @property Fragment.queryCreator - Custom Query creator for users query
 *
 * @type {UserListProps.Header} - Props from Fragment for create Header module
 * @property Header.Header - Custom header component from Fragment {@link Fragment.Header}
 * @property Header.onPressHeaderLeft - Method from Fragment {@link Fragment.onPressHeaderLeft}
 * @property Header.onPressHeaderRight - Method from Fragment {@link Fragment.onPressHeaderRight}
 *
 * @type {UserListProps.List} - Props from Fragment for create List module
 * @property List.users - Users from SendbirdChat SDK or Custom query {@link Fragment.queryCreator}
 * @property List.renderUser - Method to render User preview
 * @property List.onLoadNext - Method to load more data, called with onEndReached of FlatList
 * @property List.onRefresh - Method to refresh Users
 * @property List.refreshing - State of refreshing
 * */
export type UserListProps<User> = {
  Fragment: {
    Header?: UserListProps<User>['Header']['Header'];
    onPressHeaderLeft: UserListProps<User>['Header']['onPressHeaderLeft'];
    onPressHeaderRight: UserListProps<User>['Header']['onPressHeaderRight'];
    sortComparator?: UseUserListOptions<User>['sortComparator'];
    queryCreator?: UseUserListOptions<User>['queryCreator'];
    renderUser?: UserListProps<User>['List']['renderUser'];
  };
  Header: {
    Header?: null | CommonComponent<
      BaseHeaderProps<{
        title: string;
        right: React.ReactElement;
        onPressRight?: () => void;
        left: React.ReactElement;
        onPressLeft: () => void;
      }>
    >;
    right?: React.ReactElement;
    left?: React.ReactElement;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: (selectedUsers: User[]) => Promise<void>;
    shouldActivateHeaderRight?: (selectedUsers: User[]) => boolean;
  };
  List: {
    users: User[];
    renderUser: (
      user: User,
      selectedUsers: ContextValue<UserListContextsType<User>['List']>['selectedUsers'],
      setSelectedUsers: ContextValue<UserListContextsType<User>['List']>['setSelectedUsers'],
    ) => React.ReactElement | null;
    onLoadNext: () => Promise<void>;
    onRefresh?: () => Promise<void>;
    refreshing?: boolean;
  };
  Provider: {
    headerTitle: string;
    headerRight: (selectedUsers: Array<User>) => string;
  };
};

/**
 * Internal context for UserList
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type UserListContextsType<User> = {
  Fragment: React.Context<{
    headerTitle: string;
    headerRight: string;
  }>;
  List: React.Context<{
    selectedUsers: User[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  }>;
};

export interface UserListModule<User> {
  Provider: React.FC<UserListProps<User>['Provider']>;
  Header: CommonComponent<UserListProps<User>['Header']>;
  List: CommonComponent<UserListProps<User>['List']>;
}

export type UserListFragment<User> = React.FC<UserListProps<User>['Fragment']>;
