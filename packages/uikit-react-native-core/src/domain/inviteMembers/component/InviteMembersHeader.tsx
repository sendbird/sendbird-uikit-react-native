import React, { Context, useContext } from 'react';

import { Header as DefaultHeader, Icon, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { InviteMembersContext } from '../module/moduleContext';
import type { InviteMembersContextType, InviteMembersProps } from '../types';

const InviteMembersHeader = <T,>({
  Header = DefaultHeader,
  onPressHeaderLeft,
  onPressInviteMembers,
}: InviteMembersProps<T>['Header']) => {
  const { colors } = useUIKitTheme();
  const { selectedUsers, fragment } = useContext<InviteMembersContextType<T>>(
    InviteMembersContext as Context<InviteMembersContextType<T>>,
  );
  const canPress = selectedUsers.length > 0;
  if (!Header) return null;
  return (
    <Header
      title={fragment.headerTitle}
      right={
        <Text button color={canPress ? colors.primary : colors.onBackground04}>
          {fragment.headerRight}
        </Text>
      }
      onPressRight={canPress ? () => onPressInviteMembers(selectedUsers) : undefined}
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
    />
  );
};

export default InviteMembersHeader;
