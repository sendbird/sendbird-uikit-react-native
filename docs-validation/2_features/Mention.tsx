import type { StringSet } from '@sendbird/uikit-react-native';

/**
 * How to use
 * {@link }
 * */
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';

const App = () => {
  // @ts-ignore
  return <SendbirdUIKitContainer uikitOptions={{ groupChannel: { enableMention: true } }} />;
};
/** ------------------ **/

/**
 * Configure mention settings
 * {@link }
 * */
// import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';

const App2 = () => {
  // @ts-ignore
  return <SendbirdUIKitContainer userMention={{ mentionLimit: 10, suggestionLimit: 15 }} />;
};
/** ------------------ **/

/**
 * String resource
 * {@link}
 * */
function _stringResource(str: StringSet) {
  str.GROUP_CHANNEL;
  str.GROUP_CHANNEL.MENTION_LIMITED;

  str.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION;
  str.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION_LABEL_ON;
  str.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION_LABEL_OFF;
  str.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION_LABEL_MENTION_ONLY;

  str.GROUP_CHANNEL_NOTIFICATIONS.HEADER_TITLE;
  str.GROUP_CHANNEL_NOTIFICATIONS.MENU_NOTIFICATIONS;
  str.GROUP_CHANNEL_NOTIFICATIONS.MENU_NOTIFICATIONS_DESC;
  str.GROUP_CHANNEL_NOTIFICATIONS.MENU_NOTIFICATIONS_OPTION_ALL;
  str.GROUP_CHANNEL_NOTIFICATIONS.MENU_NOTIFICATIONS_OPTION_MENTION_ONLY;
}
/** ------------------ **/

/**
 * Icon resource
 * {@link }
 * */
import { Icon } from '@sendbird/uikit-react-native-foundation';

Icon.Assets['info'] = require('your_icons/info_icon.png');
Icon.Assets['radio-on'] = require('your_icons/radio-on_icon.png');
Icon.Assets['radio-off'] = require('your_icons/radio-off_icon.png');
/** ------------------ **/
