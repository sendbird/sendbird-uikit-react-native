## v3.4.1

- Added `channelListQueryParams` prop to `GroupChannelListFragment`. It allows you to set the query parameters for the channel list. (`collectionCreator` is deprecated and replaced by `channelListQueryParams`)
  - ```tsx
    <GroupChannelList
      channelListQueryParams={{
        includeEmpty: true,
        includeFrozen: true,
      }}
    />
    ```
- Added `messageListQueryParams` prop to `GroupChannelFragment`. It allows you to set the query parameters for the message list. (`collectionCreator` is deprecated and replaced by `messageListQueryParams`)
  - ```tsx
    <GroupChannel
      channelUrl={channelUrl}
      messageListQueryParams={{
        prevResultLimit: 20,
        customTypesFilter: ['filter'],
      }}
    />
    ```
- Fixed an issue where a type error occurred in the `CommonComponent`. It used `React.ComponentType` instead of the function structure.
