## v3.2.0

- Add chat init params to `chatOptions` in `SendbirdUIKitContainer` props.
- Add `reaction.onPressUserProfile` to `SendbirdUIKitContainer` props.
- Add `scrollToMessage` to `GroupChannelContexts.MessageList`.
- Add Voice message

  ```tsx
  const App = () => {
    return (
      <SendbirdUIKitContainer
        uikitOptions={{
          groupChannel: {
            enableVoiceMessage: true,
          },
        }}
        platformServices={{
          recorder: RecorderService,
          player: PlayerService,
        }}
      />
    );
  };
  ```

  Before using it, you should implement the `RecorderService` and `PlayerService` platform services.<br/>
  You can implement this easily by using helper functions.

  > - CLI
  >   - Install `react-native-permissions` and `react-native-audio-recorder-player`.
  >   - Create platform services using `createNativeRecorderService` and `createNativePlayerService`.
  > - Expo:
  >   - Install `expo-av`
  >   - Create platform services using `createExpoRecorderService` and `createExpoPlayerService`.

- Fix the display of a message unavailable text if the message is not accessible.
- Fix the search for messages within an accessible range.
- Fix the usage of color variants in unknown group channel messages.
- Fix the ensure that the UIKit configuration is always initialized, even in offline mode.
