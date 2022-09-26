import React from 'react';

import { CustomQuery, useUserList } from '@sendbird/uikit-chat-hooks';
import { createUserListModule, useSendbirdChat } from '@sendbird/uikit-react-native';
import type { SendbirdChatSDK, SendbirdUser } from '@sendbird/uikit-utils';

const FriendsHeader = () => <></>;
const FriendComponent = (_: { user: SendbirdUser }) => <></>;

/**
 *
 * {@link }
 * */
// TODO: sdk params
const friendMemberListQueryCreator = (sdk: SendbirdChatSDK) => {
  const friendListQuery = sdk.createFriendListQuery();
  return new CustomQuery({
    next: () => friendListQuery.next(),
    isLoading: () => friendListQuery.isLoading,
    // TODO: hasMore -> hasNext
    hasNext: () => friendListQuery.hasNext,
  });
};

const FriendsModule = createUserListModule<SendbirdUser>({ Header: FriendsHeader });

const FriendsFragment = () => {
  // TODO: import useSendbirdChat
  const { sdk } = useSendbirdChat();
  const { users, refreshing, refresh, next } = useUserList(sdk, {
    queryCreator: () => friendMemberListQueryCreator(sdk),
  });

  return (
    <FriendsModule.Provider headerRight={() => ''} headerTitle={''}>
      <FriendsModule.Header onPressHeaderLeft={() => 0} onPressHeaderRight={() => 0} />
      <FriendsModule.List
        onLoadNext={next}
        users={users}
        renderUser={(user) => <FriendComponent user={user} />}
        onRefresh={refresh}
        refreshing={refreshing}
      />
    </FriendsModule.Provider>
    // TODO: missing ')'
  );
};
/** ------------------ **/
