import React, { createContext, useState } from 'react';

import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';
import { NOOP, SendbirdFileMessage, SendbirdUserMessage } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { PubSub } from '../../../utils/pubsub';
import type { OpenChannelContextsType, OpenChannelModule, OpenChannelPubSubContextPayload } from '../types';

export const OpenChannelContexts: OpenChannelContextsType = {
  Fragment: createContext({
    headerTitle: '',
    channel: {} as SendbirdOpenChannel,
    setMessageToEdit: NOOP,
  }),
  PubSub: createContext({
    publish: NOOP,
    subscribe: () => NOOP,
  } as PubSub<OpenChannelPubSubContextPayload>),
};

export const OpenChannelContextsProvider: OpenChannelModule['Provider'] = ({
  children,
  channel,
  keyboardAvoidOffset,
  openChannelPubSub,
}) => {
  const { STRINGS } = useLocalization();
  const [messageToEdit, setMessageToEdit] = useState<SendbirdUserMessage | SendbirdFileMessage>();

  return (
    <ProviderLayout>
      <OpenChannelContexts.Fragment.Provider
        value={{
          headerTitle: STRINGS.OPEN_CHANNEL.HEADER_TITLE(channel),
          channel,
          keyboardAvoidOffset,
          messageToEdit,
          setMessageToEdit,
        }}
      >
        <OpenChannelContexts.PubSub.Provider value={openChannelPubSub}>{children}</OpenChannelContexts.PubSub.Provider>
      </OpenChannelContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
