import type { StringSet } from '@sendbird/uikit-react-native';

/**
 * String resource
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/features/reactions}
 * */
function _stringResource(str: StringSet) {
  str.GROUP_CHANNEL.LIST_NEW_LINE;
  str.GROUP_CHANNEL.LIST_FLOATING_UNREAD_MSG;
  str.LABELS.CHANNEL_MESSAGE_MARK_AS_UNREAD;
}
/** ------------------ **/
// interface StringSet {
//   GROUP_CHANNEL: {
//     LIST_NEW_LINE: string;
//     LIST_FLOATING_UNREAD_MSG: (unreadMessageCount: number) => string;
//   };
// }

// interface StringSet {
//   LABELS: {
//     CHANNEL_MESSAGE_MARK_AS_UNREAD: string;
//   };
// }

/** ------------------ **/

/**
 * Icon resource
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/features/reactions#mark-as-unread-icon-resource}
 * */
import { Icon } from '@sendbird/uikit-react-native-foundation';

Icon.Assets['mark-as-unread'] = require('your_icons/icon-mark-as-unread.png');
/** ------------------ **/
