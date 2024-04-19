/**
 * useSendbirdChat
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-usesendbirdchat-}
 * */
import { useSendbirdChat } from '@gathertown/uikit-react-native';

const Component = () => {
  const { sdk, currentUser, updateCurrentUserInfo } = useSendbirdChat();

  const onPress = async () => {
    const updatedUser = await updateCurrentUserInfo('NICKNAME', 'PROFILE_URL');
  }
}
/** ------------------ **/

/**
 * useConnection
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useconnection-}
 * */
import { useConnection, SendbirdUIKitContainer } from '@gathertown/uikit-react-native';

const Component2 = () => {
  const { connect, disconnect } = useConnection();

  const onPress = async () => {
    await connect('USER_ID', { nickname: 'NICKNAME', accessToken: 'ACCESS_TOKEN' });
    await disconnect();
  }
}

// ------------

const App = () => {
  // @ts-ignore
  return <SendbirdUIKitContainer chatOptions={{ enableAutoPushTokenRegistration: false }} />;
}
/** ------------------ **/

/**
 * useUIKitTheme
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useuikittheme-}
 * */
import { useUIKitTheme } from '@gathertown/uikit-react-native-foundation';

const Component3 = () => {
  const { colors, palette, colorScheme, typography, select } = useUIKitTheme();

  const backgroundColor = select({ dark: 'black', light: 'white' });
  const textColor = colors.text;
}
/** ------------------ **/

/**
 * usePlatformService
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useplatformservice-}
 * */
import { usePlatformService } from '@gathertown/uikit-react-native';

const Component4 = () => {
  const { fileService, notificationService, clipboardService } = usePlatformService();

  const onPress = async () => {
    const photo = await fileService.openCamera({
      mediaType: 'photo',
      onOpenFailure: () => console.log("Couldn't open camera"),
    });
  }
}
/** ------------------ **/

/**
 * useLocalization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-uselocalization-}
 * */
import { useLocalization } from '@gathertown/uikit-react-native';

const Component5 = () => {
  const { STRINGS } = useLocalization();
}
/** ------------------ **/

/**
 * useToast
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-usetoast-}
 * */
import { useToast } from '@gathertown/uikit-react-native-foundation';

const Component6 = () => {
  const toast = useToast();
  toast.show('Show message', 'success');
}
/** ------------------ **/

/**
 * usePrompt
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useprompt-}
 * */
import { usePrompt } from '@gathertown/uikit-react-native-foundation';

const Component7 = () => {
  const { openPrompt } = usePrompt();
  openPrompt({
    title: 'Prompt',
    submitLabel: 'Submit',
    onSubmit: (text) => console.log(text),
  });
}
/** ------------------ **/

/**
 * useBottomSheet
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-usebottomsheet-}
 * */
import { useBottomSheet } from '@gathertown/uikit-react-native-foundation';

const Component8 = () => {
  const { openSheet } = useBottomSheet();

  openSheet({
    sheetItems: [
      { title: 'Camera', icon: 'camera', onPress: () => console.log('Camera selected') },
      { title: 'Photo', icon: 'photo', onPress: () => console.log('Photo selected') },
      { title: 'Document', icon: 'file-document', onPress: () => console.log('Document selected') },
    ],
  });
}
/** ------------------ **/

/**
 * useActionMenu
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-useactionmenu-}
 * */
import { useActionMenu } from '@gathertown/uikit-react-native-foundation';

const Component9 = () => {
  const { openMenu } = useActionMenu();

  openMenu({
    title: 'Action Menu',
    menuItems: [
      { title: 'Title', onPress: () => null },
      { title: 'Close', onPress: () => null },
    ],
  });
}
/** ------------------ **/

/**
 * useAlert
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks#-3-usealert-}
 * */
import { useAlert } from '@gathertown/uikit-react-native-foundation';

const Component10 = () => {
  const { alert } = useAlert();

  alert({
    title: 'Title',
    message: 'Message',
    buttons: [{ text: 'Edit' }, { text: 'Send' }, { text: 'Cancel', style: 'destructive' }],
  });
}
/** ------------------ **/
