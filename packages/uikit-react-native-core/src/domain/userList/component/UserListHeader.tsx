import React, { useContext } from 'react';

import { Header as DefaultHeader, Icon, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { UserListContext } from '../module/moduleContext';
import type { UserListContextType, UserListProps } from '../types';

const HeaderDefaultRight: React.FC<{ canPress: boolean }> = ({ canPress }) => {
  const { colors } = useUIKitTheme();
  const { headerRight } = useContext(UserListContext.Fragment);
  return (
    <Text button color={canPress ? colors.primary : colors.onBackground04}>
      {headerRight}
    </Text>
  );
};

const UserListHeader = <T,>({
  Header = DefaultHeader,
  onPressHeaderLeft,
  onPressHeaderRight,
  right,
  left,
}: UserListProps<T>['Header']) => {
  const { headerTitle } = useContext(UserListContext.Fragment);
  const { selectedUsers } = useContext(UserListContext.List as UserListContextType<T>['List']);
  const canPress = selectedUsers.length > 0;

  if (!Header) return null;
  return (
    <Header
      title={headerTitle}
      right={right ?? <HeaderDefaultRight canPress={canPress} />}
      onPressRight={canPress ? () => onPressHeaderRight(selectedUsers) : undefined}
      left={left ?? <Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
    />
  );
};

export default UserListHeader;
