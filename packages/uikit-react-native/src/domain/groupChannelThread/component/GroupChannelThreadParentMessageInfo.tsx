import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  BottomSheetItem,
  Divider,
  Icon,
  Text,
  createStyleSheet,
  useAlert,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {
  Logger,
  SendbirdFileMessage,
  SendbirdMessage,
  SendbirdUserMessage,
  getAvailableUriFromFileMessage,
  getFileExtension,
  getFileType,
  isMyMessage,
  isVoiceMessage,
  shouldRenderReaction,
  toMegabyte,
} from '@sendbird/uikit-utils';

import ThreadParentMessageRenderer, {
  ThreadParentMessageRendererProps,
} from '../../../components/ThreadParentMessageRenderer';
import { useLocalization, usePlatformService, useSBUHandlers, useSendbirdChat } from '../../../hooks/useContext';
import SBUUtils from '../../../libs/SBUUtils';
import { GroupChannelThreadContexts } from '../module/moduleContext';
import type { GroupChannelThreadProps } from '../types';
import { ReactionAddons } from './../../../components/ReactionAddons';

type PressActions = { onPress?: () => void; onLongPress?: () => void; bottomSheetItem?: BottomSheetItem };
type HandleableMessage = SendbirdUserMessage | SendbirdFileMessage;
type CreateMessagePressActions = (params: { message: SendbirdMessage }) => PressActions;

const GroupChannelThreadParentMessageInfo = (props: GroupChannelThreadProps['ParentMessageInfo']) => {
  const { channel, parentMessage, setMessageToEdit } = useContext(GroupChannelThreadContexts.Fragment);
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const { sbOptions } = useSendbirdChat();

  const nickName = parentMessage.sender?.nickname || STRINGS.LABELS.USER_NO_NAME;
  const messageTimestamp = STRINGS.GROUP_CHANNEL_THREAD.PARENT_MESSAGE_TIME(parentMessage);
  const replyCountText = STRINGS.GROUP_CHANNEL_THREAD.REPLY_COUNT(parentMessage.threadInfo?.replyCount || 0);
  const createMessagePressActions = useCreateMessagePressActions({
    channel: props.channel,
    currentUserId: props.currentUserId,
    onDeleteMessage: props.onDeleteMessage,
    onPressMediaMessage: props.onPressMediaMessage,
    onEditMessage: setMessageToEdit,
  });
  const { onPress, onLongPress, bottomSheetItem } = createMessagePressActions({ message: parentMessage });

  const renderMessageInfoAndMenu = () => {
    return (
      <View style={styles.infoAndMenuContainer}>
        <Avatar size={34} uri={parentMessage.sender?.profileUrl} />
        <View style={styles.userNickAndTimeContainer}>
          <Text h2 color={colors.onBackground01} numberOfLines={1} style={styles.userNickname}>
            {nickName}
          </Text>
          <Text caption2 color={colors.onBackground03} style={styles.messageTime}>
            {messageTimestamp}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={bottomSheetItem ? onLongPress : undefined}>
          <Icon icon={'more'} color={colors.onBackground02} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderReplyCount = (replyCountText: string) => {
    if (replyCountText) {
      return (
        <View style={styles.replyContainer}>
          <Text caption3 color={colors.onBackground03} style={styles.replyText}>
            {replyCountText}
          </Text>
          <Divider />
        </View>
      );
    } else {
      return null;
    }
  };

  const renderReactionAddons = () => {
    const configs = sbOptions.uikitWithAppInfo.groupChannel.channel;
    if (shouldRenderReaction(channel, channel.isSuper ? configs.enableReactionsSupergroup : configs.enableReactions)) {
      return (
        <View style={styles.reactionButtonContainer}>
          <ReactionAddons.Message
            channel={props.channel}
            message={parentMessage}
            reactionAddonType={'thread_parent_message'}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const messageProps: ThreadParentMessageRendererProps = {
    parentMessage,
    onPress,
    onLongPress,
  };

  return (
    <View>
      <View style={styles.container}>{renderMessageInfoAndMenu()}</View>
      <View style={styles.messageContainer}>
        <ThreadParentMessageRenderer {...messageProps}></ThreadParentMessageRenderer>
      </View>
      {renderReactionAddons()}
      <Divider />
      {renderReplyCount(replyCountText)}
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'column',
  },
  infoAndMenuContainer: {
    flexDirection: 'row',
    height: 50,
    padding: 16,
    paddingBottom: 0,
  },
  userNickAndTimeContainer: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 8,
  },
  userNickname: {
    marginBottom: 2,
  },
  messageTime: {
    marginTop: 2,
  },
  contextMenuButton: {
    width: 34,
    height: 34,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reactionButtonContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  replyContainer: {
    flexDirection: 'column',
  },
  replyText: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

const useCreateMessagePressActions = ({
  channel,
  currentUserId,
  onDeleteMessage,
  onPressMediaMessage,
  onEditMessage,
}: Pick<
  GroupChannelThreadProps['ParentMessageInfo'],
  'channel' | 'currentUserId' | 'onDeleteMessage' | 'onPressMediaMessage'
> & { onEditMessage: (message: HandleableMessage) => void }): CreateMessagePressActions => {
  const handlers = useSBUHandlers();
  const { STRINGS } = useLocalization();
  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { alert } = useAlert();
  const { clipboardService, fileService } = usePlatformService();
  const { sbOptions } = useSendbirdChat();

  const onDeleteFailure = (error: Error) => {
    toast.show(STRINGS.TOAST.DELETE_MSG_ERROR, 'error');
    Logger.error(STRINGS.TOAST.DELETE_MSG_ERROR, error);
  };

  const onCopyText = (message: HandleableMessage) => {
    if (message.isUserMessage()) {
      clipboardService.setString(message.message || '');
      toast.show(STRINGS.TOAST.COPY_OK, 'success');
    }
  };

  const onDownloadFile = (message: HandleableMessage) => {
    if (message.isFileMessage()) {
      if (toMegabyte(message.size) > 4) {
        toast.show(STRINGS.TOAST.DOWNLOAD_START, 'success');
      }

      fileService
        .save({ fileUrl: message.url, fileName: message.name, fileType: message.type })
        .then((response) => {
          toast.show(STRINGS.TOAST.DOWNLOAD_OK, 'success');
          Logger.log('File saved to', response);
        })
        .catch((err) => {
          toast.show(STRINGS.TOAST.DOWNLOAD_ERROR, 'error');
          Logger.log('File save failure', err);
        });
    }
  };

  const onOpenFile = (message: HandleableMessage) => {
    if (message.isFileMessage()) {
      const fileType = getFileType(message.type || getFileExtension(message.name));
      if (['image', 'video', 'audio'].includes(fileType)) {
        onPressMediaMessage?.(message, () => onDeleteMessage(message), getAvailableUriFromFileMessage(message));
        handlers.onOpenFileURL?.(message.url);
      } else {
        const openFile = handlers.onOpenFileURL ?? SBUUtils.openURL;
        openFile(message.url);
      }
    }
  };

  const alertForMessageDelete = (message: HandleableMessage) => {
    alert({
      title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE,
      buttons: [
        { text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL },
        {
          text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_OK,
          style: 'destructive',
          onPress: () => {
            onDeleteMessage(message).catch(onDeleteFailure);
          },
        },
      ],
    });
  };

  return ({ message }) => {
    if (!message.isUserMessage() && !message.isFileMessage()) return {};

    const sheetItems: BottomSheetItem['sheetItems'] = [];
    const menu = {
      copy: (message: HandleableMessage) => ({
        icon: 'copy' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_COPY,
        onPress: () => onCopyText(message),
      }),
      edit: (message: HandleableMessage) => ({
        icon: 'edit' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_EDIT,
        onPress: () => onEditMessage?.(message),
      }),
      delete: (message: HandleableMessage) => ({
        disabled: message.threadInfo ? message.threadInfo.replyCount > 0 : undefined,
        icon: 'delete' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE,
        onPress: () => alertForMessageDelete(message),
      }),
      download: (message: HandleableMessage) => ({
        icon: 'download' as const,
        title: STRINGS.LABELS.CHANNEL_MESSAGE_SAVE,
        onPress: () => onDownloadFile(message),
      }),
    };

    if (message.isUserMessage()) {
      sheetItems.push(menu.copy(message));
      if (!channel.isEphemeral) {
        if (isMyMessage(message, currentUserId) && message.sendingStatus === 'succeeded') {
          sheetItems.push(menu.edit(message));
          sheetItems.push(menu.delete(message));
        }
      }
    }

    if (message.isFileMessage()) {
      if (!isVoiceMessage(message)) {
        sheetItems.push(menu.download(message));
      }
      if (!channel.isEphemeral) {
        if (isMyMessage(message, currentUserId) && message.sendingStatus === 'succeeded') {
          sheetItems.push(menu.delete(message));
        }
      }
    }

    const configs = sbOptions.uikitWithAppInfo.groupChannel.channel;
    const bottomSheetItem: BottomSheetItem = {
      sheetItems,
      HeaderComponent: shouldRenderReaction(
        channel,
        channel.isGroupChannel() && (channel.isSuper ? configs.enableReactionsSupergroup : configs.enableReactions),
      )
        ? ({ onClose }) => <ReactionAddons.BottomSheet message={message} channel={channel} onClose={onClose} />
        : undefined,
    };

    if (message.isFileMessage()) {
      return {
        onPress: () => onOpenFile(message),
        onLongPress: () => openSheet(bottomSheetItem),
        bottomSheetItem,
      };
    } else {
      return {
        onPress: undefined,
        onLongPress: () => openSheet(bottomSheetItem),
        bottomSheetItem,
      };
    }
  };
};

export default React.memo(GroupChannelThreadParentMessageInfo);
