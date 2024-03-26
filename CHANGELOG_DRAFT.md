## v3.5.0

- Added `enableReactionsSupergroup` to enable reactions in super group channels.
  ```tsx
  import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';

  const App = () => {
    return (
      <SendbirdUIKitContainer
        uikitOptions={{
          groupChannel: {
            enableReactionsSupergroup: true,
          },
        }}
      >
        {/* Rest of your app */}
      </SendbirdUIKitContainer>
    );
  };
  ```
