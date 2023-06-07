import type { StringSet } from '@sendbird/uikit-react-native';

/**
 * How to use
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/typing-indicator#2-how-to-use}
 * */
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
const App = () => {
  // @ts-ignore
  return <SendbirdUIKitContainer uikitOptions={{ groupChannelList: { enableTypingIndicator: true } }} />;
};
/** ------------------ **/

/**
 * String resource
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/typing-indicator#2-customize-the-ui-for-typing-indicator-3-string-resource}
 * */
type TypingIndicatorTypings = StringSet['LABELS']['TYPING_INDICATOR_TYPINGS'];
/** ------------------ **/
