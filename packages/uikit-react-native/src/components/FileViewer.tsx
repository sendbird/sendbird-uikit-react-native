import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Icon,
  Image,
  LoadingSpinner,
  Text,
  createStyleSheet,
  useAlert,
  useHeaderStyle,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import {
  Logger,
  getFileExtension,
  getFileType,
  isMyMessage,
  toMegabyte,
  truncate,
  useIIFE,
} from '@sendbird/uikit-utils';

import { useLocalization, usePlatformService, useSendbirdChat } from '../hooks/useContext';

type Props = {
  fileMessage: SendbirdFileMessage;
  deleteMessage: () => Promise<void>;

  onClose: () => void;
  onPressDownload?: (message: SendbirdFileMessage) => void;
  onPressDelete?: (message: SendbirdFileMessage) => void;

  headerShown?: boolean;
  headerTopInset?: number;
};
const FileViewer = ({
  headerShown = true,
  deleteMessage,
  headerTopInset,
  fileMessage,
  onPressDownload,
  onPressDelete,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(true);

  const { bottom } = useSafeAreaInsets();

  const { currentUser } = useSendbirdChat();
  const { palette } = useUIKitTheme();
  const { topInset, statusBarTranslucent, defaultHeight } = useHeaderStyle();
  const { STRINGS } = useLocalization();
  const { fileService, mediaService } = usePlatformService();
  const toast = useToast();
  const { alert } = useAlert();

  const basicTopInset = statusBarTranslucent ? topInset : 0;
  const canDelete = isMyMessage(fileMessage, currentUser?.userId);
  const fileType = getFileType(fileMessage.type || getFileExtension(fileMessage.url));

  useEffect(() => {
    if (fileType === 'file') onClose();
  }, []);

  const fileViewer = useIIFE(() => {
    switch (fileType) {
      case 'image': {
        return (
          <Image
            source={{ uri: fileMessage.url }}
            style={StyleSheet.absoluteFill}
            resizeMode={'contain'}
            onLoadEnd={() => setLoading(false)}
          />
        );
      }

      case 'video':
      case 'audio': {
        return (
          <mediaService.VideoComponent
            source={{ uri: fileMessage.url }}
            style={[StyleSheet.absoluteFill, { top: basicTopInset + defaultHeight, bottom: defaultHeight + bottom }]}
            resizeMode={'contain'}
            onLoad={() => setLoading(false)}
          />
        );
      }

      default: {
        return null;
      }
    }
  });

  const _onPressDelete = () => {
    if (!canDelete) return;

    if (onPressDelete) {
      onPressDelete(fileMessage);
    } else {
      alert({
        title: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_TITLE,
        buttons: [
          {
            text: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL,
          },
          {
            text: STRINGS.GROUP_CHANNEL.DIALOG_MESSAGE_DELETE_CONFIRM_OK,
            style: 'destructive',
            onPress: () => {
              deleteMessage()
                .then(() => {
                  onClose();
                })
                .catch(() => {
                  toast.show(STRINGS.TOAST.DELETE_MSG_ERROR, 'error');
                });
            },
          },
        ],
      });
    }
  };

  const _onPressDownload = () => {
    if (onPressDownload) {
      onPressDownload(fileMessage);
    } else {
      if (toMegabyte(fileMessage.size) > 4) {
        toast.show(STRINGS.TOAST.DOWNLOAD_START, 'success');
      }

      fileService
        .save({ fileUrl: fileMessage.url, fileName: fileMessage.name, fileType: fileMessage.type })
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

  return (
    <View style={{ flex: 1, backgroundColor: palette.background700 }}>
      <StatusBar barStyle={'light-content'} animated />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {fileViewer}
        {loading && <LoadingSpinner style={{ position: 'absolute' }} size={40} color={palette.primary300} />}
      </View>
      {headerShown && (
        <FileViewerHeader
          title={STRINGS.FILE_VIEWER.TITLE(fileMessage)}
          subtitle={STRINGS.FILE_VIEWER.SUBTITLE(fileMessage)}
          topInset={headerTopInset ?? basicTopInset}
          onClose={onClose}
        />
      )}
      <FileViewerFooter
        bottomInset={bottom}
        deleteShown={canDelete}
        onPressDelete={_onPressDelete}
        onPressDownload={_onPressDownload}
      />
    </View>
  );
};

type HeaderProps = {
  topInset: number;
  onClose: () => void;
  title: string;
  subtitle: string;
};
const FileViewerHeader = ({ topInset, onClose, subtitle, title }: HeaderProps) => {
  const { palette } = useUIKitTheme();
  const { defaultHeight } = useHeaderStyle();
  const { left, right } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerContainer,
        {
          paddingLeft: styles.headerContainer.paddingHorizontal + left,
          paddingRight: styles.headerContainer.paddingHorizontal + right,
        },
        { paddingTop: topInset, height: defaultHeight + topInset, backgroundColor: palette.overlay01 },
      ]}
    >
      <TouchableOpacity onPress={onClose} style={styles.barButton}>
        <Icon icon={'close'} size={24} color={palette.onBackgroundDark01} />
      </TouchableOpacity>
      <View style={styles.barTitleContainer}>
        <Text h2 color={palette.onBackgroundDark01} style={styles.headerTitle} numberOfLines={1}>
          {truncate(title, { mode: 'mid', maxLen: 18 })}
        </Text>
        <Text caption2 color={palette.onBackgroundDark01} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.barButton} />
    </View>
  );
};

type FooterProps = {
  bottomInset: number;
  deleteShown: boolean;
  onPressDelete: () => void;
  onPressDownload: () => void;
};
const FileViewerFooter = ({ bottomInset, deleteShown, onPressDelete, onPressDownload }: FooterProps) => {
  const { palette } = useUIKitTheme();
  const { defaultHeight } = useHeaderStyle();
  const { left, right } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footerContainer,
        {
          paddingLeft: styles.headerContainer.paddingHorizontal + left,
          paddingRight: styles.headerContainer.paddingHorizontal + right,
        },
        {
          paddingBottom: bottomInset,
          height: defaultHeight + bottomInset,
          backgroundColor: palette.overlay01,
        },
      ]}
    >
      <TouchableOpacity onPress={onPressDownload} style={styles.barButton}>
        <Icon icon={'download'} size={24} color={palette.onBackgroundDark01} />
      </TouchableOpacity>
      <View style={styles.barTitleContainer} />
      <TouchableOpacity onPress={onPressDelete} style={styles.barButton} disabled={!deleteShown}>
        {deleteShown && <Icon icon={'delete'} size={24} color={palette.onBackgroundDark01} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = createStyleSheet({
  headerContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  barButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginBottom: 2,
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});

export default FileViewer;
