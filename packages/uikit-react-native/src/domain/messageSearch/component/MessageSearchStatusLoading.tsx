import React from 'react';

import { Box } from '@sendbird/uikit-react-native-foundation';

import TypedPlaceholder from '../../../components/TypedPlaceholder';

const MessageSearchStatusLoading = () => {
  return (
    <Box flex={1} alignItems={'center'} justifyContent={'center'}>
      <TypedPlaceholder type={'loading'} />
    </Box>
  );
};

export default MessageSearchStatusLoading;
