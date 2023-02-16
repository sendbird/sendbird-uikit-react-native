// @ts-nocheck - !!REMOVE
import React from 'react';

import { Box } from '@sendbird/uikit-react-native-foundation';

import TypedPlaceholder from '../../../components/TypedPlaceholder';

const __domain__StatusEmpty = () => {
  return (
    <Box flex={1} alignItems={'center'} justifyContent={'center'}>
      <TypedPlaceholder type={'no-messages'} />
    </Box>
  );
};

export default __domain__StatusEmpty;
