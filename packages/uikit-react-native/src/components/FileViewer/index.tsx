import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, useAlert, useHeaderStyle, useToast, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import { Logger, getFileExtension, getFileType, isMyMessage, toMegabyte } from '@sendbird/uikit-utils';

import { useLocalization, usePlatformService, useSendbirdChat } from '../../hooks/useContext';
import FileViewerContent from './FileViewerContent';
import FileViewerFooter from './FileViewerFooter';
import FileViewerHeader from './FileViewerHeader';

type Props = {
  fileMessage: SendbirdFileMessage;
  deleteMessage: () => Promise<void>;

  onClose: () => void;
  onPressDownload?: (message: SendbirdFileMessage) => void;
  onPressDelete?: (message: SendbirdFileMessage) => void;

  headerShown?: boolean;
  headerTopInset?: number;

  /** This prop is only available on the Image viewer */
  minZoom?: number;
  /** This prop is only available on the Image viewer */
  maxZoom?: number;
};

const FileViewer = ({
  headerShown = true,
  maxZoom = 3,
  minZoom = 1,
  headerTopInset,
  fileMessage,
  onClose,
  onPressDownload,
  onPressDelete,
  deleteMessage,
}: Props) => {
  const { topInset, statusBarTranslucent } = useHeaderStyle();
  const { bottom } = useSafeAreaInsets();
  const { palette } = useUIKitTheme();
  const { alert } = useAlert();
  const { show } = useToast();

  const { fileService } = usePlatformService();
  const { currentUser } = useSendbirdChat();
  const { STRINGS } = useLocalization();

  const fileType = getFileType(fileMessage.type || getFileExtension(fileMessage.url));
  const canDelete = isMyMessage(fileMessage, currentUser?.userId);
  const basicTopInset = statusBarTranslucent ? topInset : 0;

  const onPressDeleteButton = () => {
    if (!canDelete) return;

    if (onPressDelete) {
      onPressDelete(fileMessage);
    } else {
      alert({
        title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE,
        buttons: [
          {
            text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL,
          },
          {
            text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_OK,
            style: 'destructive',
            onPress: () => {
              deleteMessage()
                .then(() => {
                  onClose();
                })
                .catch(() => {
                  show(STRINGS.TOAST.DELETE_MSG_ERROR, 'error');
                });
            },
          },
        ],
      });
    }
  };

  const onPressDownloadButton = () => {
    if (onPressDownload) {
      onPressDownload(fileMessage);
    } else {
      if (toMegabyte(fileMessage.size) > 4) {
        show(STRINGS.TOAST.DOWNLOAD_START, 'success');
      }

      fileService
        .save({ fileUrl: fileMessage.url, fileName: fileMessage.name, fileType: fileMessage.type })
        .then((response) => {
          show(STRINGS.TOAST.DOWNLOAD_OK, 'success');
          Logger.log('File saved to', response);
        })
        .catch((err) => {
          show(STRINGS.TOAST.DOWNLOAD_ERROR, 'error');
          Logger.log('File save failure', err);
        });
    }
  };

  useEffect(() => {
    if (fileType === 'file') onClose();
  }, []);

  return (
    <Box flex={1} backgroundColor={palette.background700}>
      <StatusBar barStyle={'light-content'} animated />
      <FileViewerHeader
        topInset={headerTopInset ?? basicTopInset}
        headerShown={headerShown}
        title={STRINGS.FILE_VIEWER.TITLE(fileMessage)}
        subtitle={STRINGS.FILE_VIEWER.SUBTITLE(fileMessage)}
        onClose={onClose}
      />
      <FileViewerContent
        topInset={headerTopInset ?? basicTopInset}
        bottomInset={bottom}
        type={fileType}
        src={fileMessage.url}
        maxZoom={maxZoom}
        minZoom={minZoom}
      />
      <FileViewerFooter
        bottomInset={bottom}
        deleteShown={canDelete}
        onPressDelete={onPressDeleteButton}
        onPressDownload={onPressDownloadButton}
      />
    </Box>
  );
};

export default FileViewer;
