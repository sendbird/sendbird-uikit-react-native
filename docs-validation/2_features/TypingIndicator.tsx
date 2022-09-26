import type { StringSet } from '@sendbird/uikit-react-native';

/**
 * How to use
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/typing-indicator#2-how-to-use}
 * */
// TODO: import SendbirdUIKitContainer
const App = () => {
  return <SendbirdUIKitContainer chatOptions={{ enableChannelListTypingIndicator: true }} />;
};
/** ------------------ **/

/**
 * String resource
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/typing-indicator#2-customize-the-ui-for-typing-indicator-3-string-resource}
 * */
type _TypingIndicatorTypings = StringSet['LABELS']['TYPING_INDICATOR_TYPINGS'];
/** ------------------ **/
