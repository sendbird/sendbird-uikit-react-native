import { useReducer } from 'react';

import { SendbirdChatSDK, SendbirdOpenChannel, useAsyncEffect } from '@sendbird/uikit-utils';

type State = { loading: boolean; channel?: SendbirdOpenChannel; error?: unknown };

const initialState: State = { loading: true, error: undefined, channel: undefined };
const reducer = (state: State, nextState: Partial<State>) => ({ ...state, ...nextState });

export const useOpenChannel = (sdk: SendbirdChatSDK, channelUrl: string) => {
  const [state, setState] = useReducer(reducer, initialState);

  useAsyncEffect(async () => {
    setState(initialState);

    try {
      setState({ channel: await sdk.openChannel.getChannel(channelUrl), loading: false });
    } catch (e) {
      setState({ error: e, loading: false });
    }
  }, [channelUrl]);

  return state;
};
