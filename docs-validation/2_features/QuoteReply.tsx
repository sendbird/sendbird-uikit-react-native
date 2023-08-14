/**
 * How to use
 * {@link }
 * */
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';

const App = () => {
  return (
    // @ts-ignore
    <SendbirdUIKitContainer
      appId={'APP_ID'}
      uikitOptions={{
        groupChannel: {
          replyType: 'quote_reply', // 'none', 'quote_reply'
        },
      }}
    />
  );
};
/** ------------------ **/

/**
 * String resource
 * {@link }
 * */
import { StringSet } from '@sendbird/uikit-react-native';
function _stringResource(str: StringSet) {
  str.LABELS.REPLY_FROM_SENDER_TO_RECEIVER;
  str.LABELS.CHANNEL_MESSAGE_REPLY;
  str.LABELS.CHANNEL_INPUT_PLACEHOLDER_REPLY;
  str.LABELS.CHANNEL_INPUT_REPLY_PREVIEW_TITLE;
  str.LABELS.CHANNEL_INPUT_REPLY_PREVIEW_BODY;

  str.TOAST.FIND_PARENT_MSG_ERROR;
}
/** ------------------ **/


/**
 * Icon resource
 * {@link }
 * */
import { Icon } from '@sendbird/uikit-react-native-foundation';

Icon.Assets['reply'] = require('your_icons/reply_icon.png');
/** ------------------ **/
