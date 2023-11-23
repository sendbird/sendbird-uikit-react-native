## v3.3.0

- Add typing indicator bubble feature.

  `TypingIndicatorBubble` is a new typing indicator UI that can be turned on through `typingIndicatorTypes` option.
  When turned on, it will be displayed in `GroupChannelMessageList` upon receiving typing event in real time.

  ```tsx
  import { SendbirdUIKitContainer, TypingIndicatorType } from '@sendbird/uikit-react-native';

  const App = () => {
    return (
      <SendbirdUIKitContainer
        uikitOptions={{
          groupChannel: {
            typingIndicatorTypes: new Set([TypingIndicatorType.Bubble]),
          },
        }}
      />
    );
  };
  ```

- Add `bottomSheetItem` to the props of renderMessage.

  `bottomSheetItem` is a new prop for `renderMessage` that can be utilized to add a custom item to the bottom sheet of a message.
  It can be used to add a custom menu item to the bottom sheet of a message.

  ```tsx
  import { GroupChannelMessageRenderer } from '@sendbird/uikit-react-native';
  import { useBottomSheet } from '@sendbird/uikit-react-native-foundation';

  const GroupChannelScreen = () => {
    const { openSheet } = useBottomSheet();

    const onOpenMessageMenu = () => {
      if (!props.bottomSheetItem) return;

      openSheet({
        ...props.bottomSheetItem,
        sheetItems: [
          // Update bottomSheetItem.sheetItems or append your custom menu item
          ...props.bottomSheetItem.sheetItems,
          { icon: 'search', title: 'Search', onPress: () => console.log('Search') },
        ],
      });
    };

    return (
      <GroupChannelFragment
        renderMessage={(props) => {
          return (
            <GroupChannelMessageRenderer {...props} onLongPress={() => onOpenMessageMenu(props.bottomSheetItem)} />
          );
        }}
      />
    );
  };
  ```

- Fix the not found `Promise.allSettled` error in Hermes.
- Fix the vertical alignment of iOS TextInput.
