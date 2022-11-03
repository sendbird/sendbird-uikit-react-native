import type React from 'react';

import type { ContextValue } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export interface UserListProps<User> {
  /** Props for `UserListModule.Header` **/
  Header: {
    right?: React.ReactElement;
    left?: React.ReactElement;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: (selectedUsers: User[]) => Promise<void>;
    shouldActivateHeaderRight?: (selectedUsers: User[]) => boolean;
  };
  /** Props for `UserListModule.List` **/
  List: {
    /** User list from SendbirdChat SDK or Custom query {@link Fragment.queryCreator} **/
    users: User[];
    /** Render user component **/
    renderUser: (
      user: User,
      selectedUsers: ContextValue<UserListContextsType<User>['List']>['selectedUsers'],
      setSelectedUsers: ContextValue<UserListContextsType<User>['List']>['setSelectedUsers'],
    ) => React.ReactElement | null;
    /** Load next user list **/
    onLoadNext: () => Promise<void>;
    /** Refresh user list **/
    onRefresh?: () => Promise<void>;
    /** Refreshing state **/
    refreshing?: boolean;
    /** List empty component **/
    ListEmptyComponent?: React.ReactElement;
  };
  /** Props for `UserListModule.Provider` **/
  Provider: {
    headerTitle: string;
    headerRight: (selectedUsers: Array<User>) => string;
  };
  StatusError: {
    onPressRetry: () => void;
  };
}

/**
 * Internal context for UserList
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export interface UserListContextsType<User> {
  Fragment: React.Context<{
    headerTitle: string;
    headerRight: string;
  }>;
  List: React.Context<{
    selectedUsers: User[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  }>;
}

export interface UserListModule<User> {
  Provider: CommonComponent<UserListProps<User>['Provider']>;
  Header: CommonComponent<UserListProps<User>['Header']>;
  List: CommonComponent<UserListProps<User>['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<UserListProps<User>['StatusError']>;
}
