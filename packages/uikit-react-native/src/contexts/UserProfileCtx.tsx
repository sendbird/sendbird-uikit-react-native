import React, { useCallback, useContext, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Modal, OutlinedButton, ProfileCard, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import type {
  SendbirdGroupChannel,
  SendbirdGroupChannelCreateParams,
  SendbirdMember,
  SendbirdUser,
} from '@sendbird/uikit-utils';
import { Logger, PASS, useIIFE } from '@sendbird/uikit-utils';

import { LocalizationContext } from '../contexts/LocalizationCtx';
import { SendbirdChatContext } from '../contexts/SendbirdChatCtx';

type OnCreateChannel = (channel: SendbirdGroupChannel) => void;
type OnBeforeCreateChannel = (
  channelParams: SendbirdGroupChannelCreateParams,
  users: SendbirdUser[] | SendbirdMember[],
) => SendbirdGroupChannelCreateParams | Promise<SendbirdGroupChannelCreateParams>;

export type UserProfileContextType = {
  show(user: SendbirdUser | SendbirdMember): void;
  hide(): void;
};

type Props = React.PropsWithChildren<{
  onCreateChannel?: OnCreateChannel;
  onBeforeCreateChannel?: OnBeforeCreateChannel;
}>;

let WARN_onCreateChannel = false;

export const UserProfileContext = React.createContext<UserProfileContextType | null>(null);
export const UserProfileProvider = ({ children, onCreateChannel, onBeforeCreateChannel = PASS }: Props) => {
  const chatContext = useContext(SendbirdChatContext);
  const localizationContext = useContext(LocalizationContext);

  if (!chatContext) throw new Error('SendbirdChatContext is not provided');
  if (!localizationContext) throw new Error('LocalizationContext is not provided');

  if (__DEV__ && !WARN_onCreateChannel && !onCreateChannel) {
    Logger.warn(
      'You should pass `userProfile.onCreateChannel` prop to SendbirdUIKitContainer if want to use message in a user profile',
    );
    WARN_onCreateChannel = true;
  }

  const { bottom, left, right } = useSafeAreaInsets();

  const [user, setUser] = useState<SendbirdUser | SendbirdMember>();
  const [visible, setVisible] = useState(false);

  const show: UserProfileContextType['show'] = useCallback((user) => {
    setUser(user);
    setVisible(true);
  }, []);

  const hide: UserProfileContextType['hide'] = useCallback(() => {
    setVisible(false);
  }, []);

  const userProfileButton = useIIFE(() => {
    const isMe = chatContext.currentUser && user?.userId === chatContext.currentUser.userId;
    if (isMe) return undefined;

    const onPressMessageButton = async () => {
      if (user) {
        const params: SendbirdGroupChannelCreateParams = {
          invitedUserIds: [user.userId],
          name: '',
          coverUrl: '',
          isDistinct: false,
        };

        if (chatContext.currentUser) params.operatorUserIds = [chatContext.currentUser.userId];
        const processedParams = await onBeforeCreateChannel(params, [user]);

        hide();
        const channel = await chatContext.sdk.groupChannel.createChannel(processedParams);

        if (onCreateChannel) {
          onCreateChannel(channel);
        } else {
          Logger.warn(
            'Please set `onCreateChannel` before message to user from profile card, see `userProfile` prop in the `SendbirdUIKitContainer` props',
          );
        }
      }
    };

    return (
      <OutlinedButton onPress={onPressMessageButton}>
        {localizationContext.STRINGS.PROFILE_CARD.BUTTON_MESSAGE}
      </OutlinedButton>
    );
  });

  return (
    <UserProfileContext.Provider value={{ show, hide }}>
      {children}
      <Modal
        type={'slide'}
        onClose={hide}
        onDismiss={() => setUser(undefined)}
        visible={visible && Boolean(user)}
        backgroundStyle={styles.modal}
      >
        {user && (
          <ProfileCard
            containerStyle={[
              styles.profileCardContainer,
              { paddingLeft: left, paddingRight: right, paddingBottom: bottom },
            ]}
            uri={user.profileUrl}
            username={user.nickname || localizationContext.STRINGS.LABELS.USER_NO_NAME}
            bodyLabel={localizationContext.STRINGS.PROFILE_CARD.BODY_LABEL}
            body={localizationContext.STRINGS.PROFILE_CARD.BODY(user)}
            button={userProfileButton}
          />
        )}
      </Modal>
    </UserProfileContext.Provider>
  );
};

const styles = createStyleSheet({
  modal: {
    justifyContent: 'flex-end',
  },
  profileCardContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});
