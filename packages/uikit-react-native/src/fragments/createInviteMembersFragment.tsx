import React, { useContext } from 'react';

import type {
  InviteMembersContextType,
  InviteMembersFragment,
  InviteMembersModule,
  InviteMembersProps,
} from '@sendbird/uikit-react-native-core';
import { InviteMembersContext, createInviteMembersModule, useLocalization } from '@sendbird/uikit-react-native-core';
import { Header as DefaultHeader, Icon } from '@sendbird/uikit-react-native-foundation';
import { AsyncEmptyFunction } from '@sendbird/uikit-utils';

const FragmentDefaultHeader = <T,>({
  Header,
  onPressHeaderLeft,
  onPressInviteMembers,
}: {
  Header: InviteMembersProps<T>['Fragment']['Header'];
  onPressHeaderLeft: InviteMembersProps<T>['Fragment']['onPressHeaderLeft'];
  onPressInviteMembers: InviteMembersProps<T>['Fragment']['onPressInviteMembers'];
}) => {
  const { selectedUsers } = useContext<InviteMembersContextType<T>>(
    InviteMembersContext as React.Context<InviteMembersContextType<T>>,
  );
  const { LABEL } = useLocalization();
  if (!Header) return null;

  return (
    <Header
      title={LABEL.INVITE_MEMBERS.HEADER_TITLE}
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={LABEL.INVITE_MEMBERS.HEADER_RIGHT({ selectedUsers })}
      onPressRight={onPressInviteMembers}
    />
  );
};

const createInviteMembersFragment = <T,>(initModule?: InviteMembersModule<T>): InviteMembersFragment<T> => {
  const InviteMembersModule = createInviteMembersModule<T>(initModule);

  // TODO: createUserQuery from @sendbird/chat-react-hooks

  return ({
    Header = DefaultHeader as InviteMembersProps<T>['Fragment']['Header'],
    onPressHeaderLeft,
    onPressInviteMembers,
    children,
  }) => {
    return (
      <InviteMembersModule.Provider>
        <FragmentDefaultHeader<T>
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
