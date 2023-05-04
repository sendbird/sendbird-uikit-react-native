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

### Removed

- Items that were marked as deprecated have been removed.

### Migrations
