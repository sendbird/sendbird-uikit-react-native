import React, { useState } from 'react';

import { FileViewer, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import type { Routes } from '../../libs/navigation';

const FileViewerScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.FileViewer>();
  const [fileMessage] = useState(() => sdk.FileMessage.buildFromSerializedData(params.serializedFileMessage));
  return (
    <FileViewer fileMessage={fileMessage} onClose={() => navigation.goBack()} deleteMessage={params.deleteMessage} />
  );
};

export default FileViewerScreen;
