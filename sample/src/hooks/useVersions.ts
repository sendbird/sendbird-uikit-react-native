import SendbirdChat from '@sendbird/chat';
import { SendbirdUIKit } from '@gathertown/uikit-react-native';

const useVersions = () => {
  return {
    chat: SendbirdChat.version,
    uikit: SendbirdUIKit.VERSION,
  };
};

export default useVersions;
