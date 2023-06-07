import React from 'react';

import { createMessageSearchFragment, SendbirdUIKitContainer, StringSet } from "@sendbird/uikit-react-native";
import { Icon } from "@sendbird/uikit-react-native-foundation";

const MySearchResultItem = (_: object) => <React.Fragment />;

/**
 * Message search
 * */
const App = () => {
  return (
    //@ts-ignore
    <SendbirdUIKitContainer
      uikitOptions={{
        groupChannelSettings: {
          enableMessageSearch: true
        }
      }}
    />
  );
};
/** ------------------ **/

/**
 * Customize the UI for message search
 * {@link https://sendbird.com/docs/uikit/v3/react-native/beta-features/message-search#2-customize-the-ui-for-message-search}
 * */
const MessageSearchFragment = createMessageSearchFragment();

const MessageSearchScreen = () => {
  return (
    // @ts-ignore
    <MessageSearchFragment
      renderSearchResultItem={(props) => {
        return <MySearchResultItem {...props} />;
      }}
    />
  );
};
/** ------------------ **/

/**
 * String resource
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/message-search#2-customize-the-ui-for-message-search-3-string-resource}
 * */
function _stringResource(str: StringSet) {
  str.MESSAGE_SEARCH.HEADER_INPUT_PLACEHOLDER
  str.MESSAGE_SEARCH.HEADER_RIGHT;
  str.MESSAGE_SEARCH.SEARCH_RESULT_ITEM_BODY
  str.MESSAGE_SEARCH.SEARCH_RESULT_ITEM_TITLE
  str.MESSAGE_SEARCH.SEARCH_RESULT_ITEM_TITLE_CAPTION

  str.PLACEHOLDER.NO_RESULTS_FOUND;
}
/** ------------------ **/

/**
 * Icon resource
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/message-search#2-customize-the-ui-for-message-search-3-icon-resource}
 * */
Icon.Assets['photo'] = require('your_icons/photo_icon.png');
Icon.Assets['play'] = require('your_icons/play_icon.png');
Icon.Assets['file-audio'] = require('your_icons/file-audio_icon.png');
Icon.Assets['file-document'] = require('your_icons/file-document_icon.png');
Icon.Assets['search'] = require('your_icons/search_icon.png');
Icon.Assets['remove'] = require('your_icons/remove_icon.png');
/** ------------------ **/
