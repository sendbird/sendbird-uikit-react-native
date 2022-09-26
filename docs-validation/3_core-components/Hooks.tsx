/**
 * useSendbirdChat
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-usesendbirdchat-}
 * */
// TODO: import useSendbirdChat, wrap with component
const { sdk, currentUser, updateCurrentUserInfo } = useSendbirdChat();

const updatedUser = await updateCurrentUserInfo('NICKNAME', 'PROFILE_URL');
/** ------------------ **/

/**
 * useConnection
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useconnection-}
 * */
// TODO: import useConnection, wrap with component
const { connect, disconnect } = useConnection();

connect('USER_ID', { nickname: 'NICKNAME', accessToken: 'ACCESS_TOKEN' });
disconnect();

// ------------

// TODO: import SendbirdUIKitContainer, wrap with component
<SendbirdUIKitContainer chatOptions={{ enableAutoPushTokenRegistration: false }} />;
/** ------------------ **/

/**
 * useUIKitTheme
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useuikittheme-}
 * */
// TODO: import useUIKitTheme, wrap with component
const { colors, _palette, _colorScheme, _typography, select } = useUIKitTheme();

const backgroundColor = select({ dark: 'black', light: 'white' });
const textColor = colors.text;
/** ------------------ **/

/**
 * usePlatformService
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useplatformservice-}
 * */
// TODO: import usePlatformService, Alert, wrap with component
const { fileService, notificationService, clipboardService } = usePlatformService();

const photo = await fileService.openCamera({
  mediaType: 'photo',
  onOpenFailure: () => Alert.alert("Couldn't open camera"),
});
/** ------------------ **/

/**
 * useLocalization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-uselocalization-}
 * */
// TODO: import useLocalization
const { STRINGS } = useLocalization();
/** ------------------ **/

/**
 * useToast
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-usetoast-}
 * */
// TODO: import useToast
const toast = useToast();

toast.show('Show message', 'success');
/** ------------------ **/

/**
 * usePrompt
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useprompt-}
 * */
// TODO: import usePrompt
const { openPrompt } = usePrompt();

openPrompt({
  title: 'Prompt',
  submitLabel: 'Submit',
  onSubmit: (text) => console.log(text),
});
/** ------------------ **/

/**
 * useBottomSheet
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-usebottomsheet-}
 * */
// TODO: import useBottomSheet
const { openSheet } = useBottomSheet();

openSheet({
  sheetItems: [
    { title: 'Camera', icon: 'camera', onPress: () => alert({ title: 'Camera selected' }) },
    { title: 'Photo', icon: 'photo', onPress: () => alert({ title: 'Photo selected' }) },
    { title: 'Document', icon: 'file-document', onPress: () => alert({ title: 'Document selected' }) },
  ],
});
/** ------------------ **/

/**
 * useActionMenu
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useactionmenu-}
 * */
// TODO: import useActionMenu
const { openMenu } = useActionMenu();

openMenu({
  title: 'Action Menu',
  menuItems: [
    { title: 'Title', onPress: () => null },
    { title: 'Close', onPress: () => null },
  ],
});
/** ------------------ **/

/**
 * useAlert
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-usealert-}
 * */
// TODO: import useAlert
const { alert } = useAlert();

alert({
  title: 'Title',
  message: 'Message',
  buttons: [{ text: 'Edit' }, { text: 'Send' }, { text: 'Cancel', style: 'destructive' }],
});
/** ------------------ **/
