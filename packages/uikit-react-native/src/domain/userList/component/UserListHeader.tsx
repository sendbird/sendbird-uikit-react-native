import React, { useContext } from 'react';

import { Icon, Text, useHeaderStyle, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { UserListContexts } from '../module/moduleContext';
import type { UserListContextsType, UserListProps } from '../types';

const UserListHeader = <T,>({
  onPressHeaderLeft,
  onPressHeaderRight,
  right,
  left,
  shouldActivateHeaderRight = (selectedUsers) => selectedUsers.length > 0,
}: UserListProps<T>['Header']) => {
  const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);
  const { selectedUsers } = useContext(UserListContexts.List as UserListContextsType<T>['List']);
  const { HeaderComponent } = useHeaderStyle();
  const { colors } = useUIKitTheme();

  const isActive = shouldActivateHeaderRight(selectedUsers);

  return (
    <HeaderComponent
      title={headerTitle}
      right={
        right ?? (
          <Text button color={isActive ? colors.primary : colors.onBackground04}>
            {headerRight}
          </Text>
        )
      }
      onPressRight={isActive ? () => onPressHeaderRight(selectedUsers) : undefined}
      left={left ?? <Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
    />
  );
};

export default UserListHeader;
