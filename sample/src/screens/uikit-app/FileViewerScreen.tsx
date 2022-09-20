import React, { useState } from 'react';

import { FileViewer, useSendbirdChat } from '@sendbird/uikit-react-native';
import type { SendbirdFileMessage } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import type { Routes } from '../../libs/navigation';

const FileViewerScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.FileViewer>();
  const [fileMessage] = useState(
    () => sdk.message.buildMessageFromSerializedData(params.serializedFileMessage) as SendbirdFileMessage,
  );
  return (
    <FileViewer fileMessage={fileMessage} onClose={() => navigation.goBack()} deleteMessage={params.deleteMessage} />
  );
};

export default FileViewerScreen;
