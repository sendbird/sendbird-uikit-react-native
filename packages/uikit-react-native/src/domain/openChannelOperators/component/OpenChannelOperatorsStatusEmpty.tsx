import React from 'react';

import { Box } from '@sendbird/uikit-react-native-foundation';

import TypedPlaceholder from '../../../components/TypedPlaceholder';

const OpenChannelOperatorsStatusEmpty = () => {
  return (
    <Box flex={1} alignItems={'center'} justifyContent={'center'}>
      <TypedPlaceholder type={'no-users'} />
    </Box>
  );
};

export default OpenChannelOperatorsStatusEmpty;
