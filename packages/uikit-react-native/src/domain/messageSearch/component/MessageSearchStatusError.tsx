import React from 'react';

import { Box } from '@sendbird/uikit-react-native-foundation';

import TypedPlaceholder from '../../../components/TypedPlaceholder';
import type { MessageSearchModule } from '../types';

const MessageSearchStatusError: MessageSearchModule['StatusError'] = ({ onPressRetry }) => {
  return (
    <Box flex={1} alignItems={'center'} justifyContent={'center'}>
      <TypedPlaceholder type={'error-wrong'} onPressRetry={onPressRetry} />
    </Box>
  );
};

export default MessageSearchStatusError;
