import React, { useContext, useState } from 'react';

import ChannelMessageList from '../../../components/ChannelMessageList';
import { OpenChannelContexts } from '../module/moduleContext';
import type { OpenChannelProps } from '../types';

const OpenChannelMessageList = (props: OpenChannelProps['MessageList']) => {
  const { setMessageToEdit } = useContext(OpenChannelContexts.Fragment);
  const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = useState(false);
  return (
    <ChannelMessageList
      {...props}
      scrolledAwayFromBottom={scrolledAwayFromBottom}
      onScrolledAwayFromBottom={setScrolledAwayFromBottom}
      onEditMessage={setMessageToEdit}
    />
  );
};

export default React.memo(OpenChannelMessageList);
