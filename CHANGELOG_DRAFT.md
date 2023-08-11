## v3.1.0

### Features

- Added Quote reply feature in group channels (default: turned on)
  ```tsx
  const App = () => {
    <SendbirdUIKitContainer
      appId={APP_ID}
      uikitOptions={{
        groupChannel: {
          replyType: 'none', // 'none', 'quote_reply'
        },
      }}
    />;
  };
  ```

### Improvements

- Updated the minimum chat SDK version to v4.9.8.
- Improved video thumbnail fetching and caching logic in the native media service.
- Enhanced stability.
