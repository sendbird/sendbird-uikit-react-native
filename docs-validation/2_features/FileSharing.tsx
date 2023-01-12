import React from 'react';

import type { StringSet } from '@sendbird/uikit-react-native';
import { Icon } from '@sendbird/uikit-react-native-foundation';
import type { UIKitColors } from '@sendbird/uikit-react-native-foundation';

const CustomFileMessage = (_: object) => <React.Fragment />;
const isImageFile = (x: string) => x;

/**
 * Customize the UI for file sharing
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/file-sharing#2-customize-the-ui-for-file-sharing}
 * */
import { createGroupChannelFragment, MessageRenderer } from '@sendbird/uikit-react-native';

const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelScreen = () => {
  return (
    // @ts-ignore
    <GroupChannelFragment
      renderMessage={(props) => {
        if (props.message.isFileMessage()) {
          return <CustomFileMessage {...props} />;
        }
        return <MessageRenderer {...props} />;
      }}
    />
  );
};
/** ------------------ **/

/**
 * Color resource
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/file-sharing#2-customize-the-ui-for-file-sharing-3-color-resource}
 * */
function _colorResource(colors: UIKitColors) {
  colors.ui.message;
  colors.ui.message.incoming;
  colors.ui.message.outgoing;
  colors.ui.message.incoming.pressed;
  colors.ui.message.incoming.enabled;
  colors.ui.message.incoming.pressed.textEdited;
  colors.ui.message.incoming.pressed.textMsg;
  colors.ui.message.incoming.pressed.textSenderName;
  colors.ui.message.incoming.pressed.textTime;
  colors.ui.message.incoming.pressed.background;
}
/** ------------------ **/

/**
 * Icon resource
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/file-sharing#2-customize-the-ui-for-file-sharing-3-icon-resource}
 * */
Icon.Assets['add'] = require('your_icons/add_icon.png');
Icon.Assets['document'] = require('your_icons/document_icon.png');
Icon.Assets['file-audio'] = require('your_icons/file-audio_icon.png');
Icon.Assets['file-document'] = require('your_icons/file-document_icon.png');
Icon.Assets['play'] = require('your_icons/play_icon.png');
/** ------------------ **/

/**
 * String resource
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/file-sharing#2-customize-the-ui-for-file-sharing-3-string-resource}
 * */
function _stringResource(str: StringSet) {
  str.GROUP_CHANNEL;
  str.GROUP_CHANNEL.MESSAGE_BUBBLE_FILE_TITLE;
  str.GROUP_CHANNEL.DIALOG_ATTACHMENT_CAMERA;
  str.GROUP_CHANNEL.DIALOG_ATTACHMENT_PHOTO_LIBRARY;
  str.GROUP_CHANNEL.DIALOG_ATTACHMENT_FILES;

  str.TOAST;
  str.TOAST.OPEN_CAMERA_ERROR;
  str.TOAST.OPEN_PHOTO_LIBRARY_ERROR;
  str.TOAST.OPEN_FILES_ERROR;
  str.TOAST.DOWNLOAD_START;
  str.TOAST.DOWNLOAD_OK;
  str.TOAST.DOWNLOAD_ERROR;
}
/** ------------------ **/

/**
 * Image compression
 * {@link https://sendbird.com/docs/uikit/v3/react-native/features/file-sharing#2-image-compression}
 * */
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';

const App = () => {
  return (
    <SendbirdUIKitContainer
      appId={'APP_ID'}
      // @ts-ignore
      platformServices={{}}
      chatOptions={{
        enableImageCompression: true
      }}
      imageCompression={{
        compressionRate: 0.5,
        width: 600,
        height: 600
      }}
    />
  );
};
/** ------------------ **/
