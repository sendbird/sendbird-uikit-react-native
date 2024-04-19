import React from 'react';

const FriendsHeader = () => <></>;
const FriendComponent = (_: { user: SendbirdUser }) => <></>;

/**
 * Customize a Fragment
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/fragment#2-customize-a-fragment}
 * */
import { CustomQuery, useUserList } from '@gathertown/uikit-chat-hooks';
import { createUserListModule, useSendbirdChat } from '@gathertown/uikit-react-native';
import type { SendbirdChatSDK, SendbirdUser } from '@gathertown/uikit-utils';

const friendMemberListQueryCreator = (sdk: SendbirdChatSDK) => {
  const friendListQuery = sdk.createFriendListQuery();
  return new CustomQuery({
    next: () => friendListQuery.next(),
    isLoading: () => friendListQuery.isLoading,
    hasNext: () => friendListQuery.hasNext,
  });
};

const FriendsModule = createUserListModule<SendbirdUser>({
  Header: FriendsHeader // Custom Header
});

const FriendsFragment = () => {
  const { sdk } = useSendbirdChat();
  const { users, refreshing, refresh, next } = useUserList(sdk, {
    queryCreator: () => friendMemberListQueryCreator(sdk), // Custom queryCreator
  });

  return (
    // @ts-ignore
    <FriendsModule.Provider>
      {/* @ts-ignore */}
      <FriendsModule.Header />
      <FriendsModule.List
        onLoadNext={next}
        users={users}
        renderUser={(user) => <FriendComponent user={user} />} // Custom renderUser
        onRefresh={refresh}
        refreshing={refreshing}
      />
    </FriendsModule.Provider>
  );
};
/** ------------------ **/
