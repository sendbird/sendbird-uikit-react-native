## v2.5.0

### Added message search feature

- Added `createMessageSearchFragment` and `createMessageSearchModule`.
- Added `searchItem` prop to `GroupChannelFragment`.

### `@sendbird/react-native-scrollview-enhancer` module as peer dependency.

- Added `@sendbird/react-native-scrollview-enhancer` module as a peer dependency to support bidirectional scrolling and `maintainVisibleContentPosition` on Android with versions lower than `0.72`.
- Note that this module includes an Android native module.

### Changes to the behavior of `useGroupChannelMessagesWithCollection`.

- Due to the support of the `maintainVisibleContentPosition` prop, `nextMessages` and `newMessagesFromMembers` have been deprecated and replaced with `newMessages`.
