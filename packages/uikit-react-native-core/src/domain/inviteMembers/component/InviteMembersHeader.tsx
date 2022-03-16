import React, { useContext } from 'react';

import { Header as DefaultHeader, Icon, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { InviteMembersContext } from '../module/moduleContext';
import type { InviteMembersContextType, InviteMembersProps } from '../types';

const InviteMembersHeader = <T,>({
  Header = DefaultHeader,
  onPressHeaderLeft,
  onPressInviteMembers,
}: InviteMembersProps<T>['Header']) => {
  const { colors } = useUIKitTheme();
  const { headerRight, headerTitle } = useContext(InviteMembersContext.Fragment);

  const { selectedUsers } = useContext(InviteMembersContext.List as InviteMembersContextType<T>['List']);
  const canPress = selectedUsers.length > 0;
  if (!Header) return null;
  return (
    <Header
      title={headerTitle}
      right={
        <Text button color={canPress ? colors.primary : colors.onBackground04}>
          {headerRight}
        </Text>
      }
      onPressRight={canPress ? () => onPressInviteMembers(selectedUsers) : undefined}
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
    />
  );
};

export default InviteMembersHeader;
