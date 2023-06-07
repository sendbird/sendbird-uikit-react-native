/**
 * How to use
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/read-receipt#2-how-to-use}
 * */
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
const App = () => {
  // @ts-ignore
  return <SendbirdUIKitContainer uikitOptions={{ groupChannelList: { enableMessageReceiptStatus: true } }} />;
};
/** ------------------ **/

/**
 * Icon resource
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/read-receipt#2-customize-the-ui-for-delivery-receipt-3-icon-resource}
 * */
import { Icon } from '@sendbird/uikit-react-native-foundation';

Icon.Assets['done-all'] = require('your_icons/done-all_icon.png');
/** ------------------ **/
