## v2.5.0

### Added message search feature

- Added `createMessageSearchFragment` and `createMessageSearchModule`.
- Added `searchItem` prop to `GroupChannelFragment`.

### `@sendbird/react-native-scrollview-enhancer` module as peer dependency.

- Added `@sendbird/react-native-scrollview-enhancer` module as a peer dependency to support bidirectional scrolling and `maintainVisibleContentPosition` on Android with versions lower than `0.72`.
- If your React-Native version is `0.63.x`, please use `v0.1.2`. If it is `0.64.x` or higher, please use `v0.2.0`.
- Note that this module includes an Android native module.

### Changes to the behavior of `useGroupChannelMessagesWithCollection`.

- Due to the support of the `maintainVisibleContentPosition` prop, `nextMessages` and `newMessagesFromMembers` have been deprecated and replaced with `newMessages`.

---

# Prepare v3.0.0

## Breaking changes

### The minimum React-Native version has been increased from 0.63.3 to 0.65.0.

- Supports stable Metro bundler version.
- Supports stable React-Native APIs (e.g. EventSubscription).
- Minimum iOS version for deployment has been changed to 11. ([link](https://developer.apple.com/documentation/xcode-release-notes/xcode-14-release-notes#Deprecations))
- An increase in the minimum Gradle version is required for stable operation.

### Local cache is now a mandatory requirement.

- You must inject localCacheStorage into SendbirdUIKitContainer.

```tsx
<SendbirdUIKitContainer chatOptions={{ localCacheStorage: AsyncStorage }} />
```

## Migrations & Removed (deprecated item removal)

### @sendbird/uikit-react-native

- StringSet

  - `OPEN_CHANNEL.LIST_BANNER_FROZEN` is replaced with `LABELS.CHANNEL_MESSAGE_LIST_FROZEN`
  - `GROUP_CHANNEL.LIST_BANNER_FROZEN` is replaced with `LABELS.CHANNEL_MESSAGE_LIST_FROZEN`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_COPY` is replaced with `LABELS.CHANNEL_MESSAGE_COPY`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_EDIT` is replaced with `LABELS.CHANNEL_MESSAGE_EDIT`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_SAVE` is replaced with `LABELS.CHANNEL_MESSAGE_SAVE`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_DELETE` is replaced with `LABELS.CHANNEL_MESSAGE_DELETE`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_TITLE` is replaced with `LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_OK` is replaced with `LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_OK`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL` is replaced with `LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_FAILED_RETRY` is replaced with `LABELS.CHANNEL_MESSAGE_FAILED_RETRY`
  - `GROUP_CHANNEL.DIALOG_MESSAGE_FAILED_REMOVE` is replaced with `LABELS.CHANNEL_MESSAGE_FAILED_REMOVE`
  - `GROUP_CHANNEL.DIALOG_ATTACHMENT_CAMERA` is replaced with `LABELS.CHANNEL_INPUT_ATTACHMENT_CAMERA`
  - `GROUP_CHANNEL.DIALOG_ATTACHMENT_PHOTO_LIBRARY` is replaced with `LABELS.CHANNEL_INPUT_ATTACHMENT_PHOTO_LIBRARY`
  - `GROUP_CHANNEL.DIALOG_ATTACHMENT_FILES` is replaced with `LABELS.CHANNEL_INPUT_ATTACHMENT_FILES`
  - `GROUP_CHANNEL.INPUT_PLACEHOLDER_ACTIVE` is replaced with `LABELS.CHANNEL_INPUT_PLACEHOLDER_ACTIVE`
  - `GROUP_CHANNEL.INPUT_PLACEHOLDER_DISABLED` is replaced with `LABELS.CHANNEL_INPUT_PLACEHOLDER_DISABLED`
  - `GROUP_CHANNEL.INPUT_PLACEHOLDER_MUTED` is replaced with `LABELS.CHANNEL_INPUT_PLACEHOLDER_MUTED`
  - `GROUP_CHANNEL.INPUT_EDIT_OK` is replaced with `LABELS.CHANNEL_INPUT_EDIT_OK`
  - `GROUP_CHANNEL.INPUT_EDIT_CANCEL` is replaced with `LABELS.CHANNEL_INPUT_EDIT_CANCEL`
  - `GROUP_CHANNEL_MEMBERS.USER_BAR_ME_POSTFIX` is replaced with `LABELS.USER_BAR_ME_POSTFIX`
  - `GROUP_CHANNEL_MEMBERS.USER_BAR_OPERATOR` is replaced with `LABELS.USER_BAR_OPERATOR`

- `ChannelMessageList` (`GroupChannelProps`, `OpenChannelProps`)

  - `onPressImageMessage` prop is replaced with `onPressMediaMessage`
  - `onLeaveScrollBottom` prop is replaced with `onScrolledAwayFromBottom`
  - `onPressAvatar` prop is replaced with `onShowUserProfile`

- `MessageRenderer` component is replaced with `GroupChannelMessageRenderer`

- `ChannelInput` (`GroupChannelProps`, `OpenChannelProps`)
  - `onSendFileMessage` prop is replaced with `onPressSendUserMessage`
  - `onSendUserMessage` prop is replaced with `onPressSendUserMessage`
  - `onUpdateFileMessage` prop is replaced with `onPressUpdateUserMessage`
  - `onUpdateUserMessage` prop is replaced with `onPressUpdateFileMessage`

### @sendbird/uikit-chat-hooks

- `useGroupChannelMessages`, `useOpenChannelMessages`
  - `nextMessages` and `newMessagesFromMembers` properties are replaced with `newMessages`

### @sendbird/uikit-react-native-foundation

- Theme
  - `Messsage` in colors is replaced with `GroupChannelMessage` (`colors.ui.message` -> `colors.ui.groupChannelMessage`)
