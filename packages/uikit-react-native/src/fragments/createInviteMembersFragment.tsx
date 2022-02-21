import React from 'react';

import type { InviteMembersFragment, InviteMembersModule, InviteMembersProps } from '@sendbird/uikit-react-native-core';
import { createInviteMembersModule } from '@sendbird/uikit-react-native-core';
import { Header as DefaultHeader } from '@sendbird/uikit-react-native-foundation';
import { AsyncEmptyFunction } from '@sendbird/uikit-utils';

const createInviteMembersFragment = <UserType,>(
  initModule?: InviteMembersModule<UserType>,
): InviteMembersFragment<UserType> => {
  const InviteMembersModule = createInviteMembersModule<UserType>(initModule);

  // TODO: createUserQuery from @sendbird/chat-react-hooks

  return ({
    Header = DefaultHeader as InviteMembersProps<UserType>['Fragment']['Header'],
    onPressHeaderLeft,
    onPressInviteMembers,
    children,
  }) => {
    return (
      <InviteMembersModule.Provider>
        <InviteMembersModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressInviteMembers={onPressInviteMembers}
        />
        <InviteMembersModule.List
          onLoadMore={AsyncEmptyFunction}
          users={[]}
          renderUser={() => null}
          onRefresh={AsyncEmptyFunction}
          refreshing={false}
        />
        {children}
      </InviteMembersModule.Provider>
    );
  };
};

export default createInviteMembersFragment;
