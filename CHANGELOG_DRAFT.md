## v3.7.2

### Feat

- Added event handlers interface for `onOpenURL` and `onOpenFileURL` to `SendbirdUIKitContainer`.
  ```tsx
  <SendbirdUIKitContainer
    appId={APP_ID}
    handlers={{
      onOpenURL: (url) => {
        console.log('onOpenURL', url);
      },
      onOpenFileURL: (url) => {
        console.log('onOpenFileURL', url);
      },
    }}
  />
  ```
