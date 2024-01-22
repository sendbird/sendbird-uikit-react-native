import React from 'react';

import {
  Avatar,
  BottomSheetItem,
  Box,
  PressBox,
  TextInput,
  createStyleSheet,
  useBottomSheet,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import Icon from '@sendbird/uikit-react-native-foundation/src/components/Icon';
import { ifThenOr, useSafeAreaPadding } from '@sendbird/uikit-utils';

import { useLocalization, usePlatformService } from '../../../hooks/useContext';
import SBUError from '../../../libs/SBUError';
import SBUUtils from '../../../libs/SBUUtils';
import type { OpenChannelCreateProps } from '../types';

const OpenChannelCreateProfileInput = ({
  channelName,
  channelCoverFile,
  onChangeChannelName,
  onChangeChannelCoverFile,
}: OpenChannelCreateProps['ProfileInput']) => {
  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { palette, colors, typography } = useUIKitTheme();
  const safeArea = useSafeAreaPadding(['left', 'right']);

  const { STRINGS } = useLocalization();
  const { fileService } = usePlatformService();

  const onPressPhotoButton = () => {
    const sheetItems: BottomSheetItem['sheetItems'] = [
      {
        title: STRINGS.OPEN_CHANNEL_CREATE.DIALOG_IMAGE_MENU_CAMERA,
        onPress: async () => {
          const mediaFile = await fileService.openCamera({
            mediaType: 'photo',
            onOpenFailure: (error) => {
              if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
                alert({
                  title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                  message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                    STRINGS.LABELS.PERMISSION_CAMERA,
                    STRINGS.LABELS.PERMISSION_APP_NAME,
                  ),
                  buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
                });
              } else {
                toast.show(STRINGS.TOAST.OPEN_CAMERA_ERROR, 'error');
              }
            },
          });

          if (mediaFile) onChangeChannelCoverFile(mediaFile);
        },
      },
      {
        title: STRINGS.OPEN_CHANNEL_CREATE.DIALOG_IMAGE_MENU_PHOTO_LIBRARY,
        onPress: async () => {
          const mediaFiles = await fileService.openMediaLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
            onOpenFailure: (error) => {
              if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
                alert({
                  title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                  message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                    STRINGS.LABELS.PERMISSION_DEVICE_STORAGE,
                    STRINGS.LABELS.PERMISSION_APP_NAME,
                  ),
                  buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
                });
              } else {
                toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error');
              }
            },
          });
          if (mediaFiles?.[0]) onChangeChannelCoverFile(mediaFiles[0]);
        },
      },
    ];

    if (channelCoverFile) {
      sheetItems.unshift({
        title: STRINGS.OPEN_CHANNEL_CREATE.DIALOG_IMAGE_MENU_REMOVE,
        titleColor: colors.error,
        onPress: () => {
          onChangeChannelCoverFile(undefined);
        },
      });
    }

    openSheet({ sheetItems });
  };

  return (
    <Box
      flexDirection={'row'}
      paddingVertical={16}
      paddingLeft={16 + safeArea.paddingLeft}
      paddingRight={16 + safeArea.paddingRight}
    >
      <PressBox onPress={onPressPhotoButton} style={styles.coverButton} activeOpacity={0.8}>
        {ifThenOr(
          Boolean(channelCoverFile),
          <Avatar size={72} uri={channelCoverFile?.uri} />,
          <Avatar.Icon size={72} icon={'camera'} />,
        )}
      </PressBox>
      <Box borderBottomColor={colors.onBackground04} style={styles.inputContainer}>
        <TextInput
          placeholder={STRINGS.OPEN_CHANNEL_CREATE.PLACEHOLDER}
          style={[typography.subtitle1, styles.input, { backgroundColor: palette.transparent }]}
          value={channelName}
          onChangeText={onChangeChannelName}
        />

        {channelName.length > 0 && (
          <PressBox onPress={() => onChangeChannelName('')} style={styles.removeButtonContainer}>
            <Icon color={colors.onBackground03} size={22} icon={'remove'} />
          </PressBox>
        )}
      </Box>
    </Box>
  );
};

const styles = createStyleSheet({
  coverButton: {
    marginRight: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  removeButtonContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default OpenChannelCreateProfileInput;
