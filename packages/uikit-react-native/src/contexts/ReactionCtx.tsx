import React, { useCallback, useContext, useReducer } from 'react';

import type { SendbirdBaseChannel, SendbirdBaseMessage } from '@sendbird/uikit-utils';

import { LocalizationContext } from '../contexts/LocalizationCtx';
import { SendbirdChatContext } from '../contexts/SendbirdChatCtx';

type State = { message?: SendbirdBaseMessage; channel?: SendbirdBaseChannel };
export type ReactionContextType = {
  openReactionList(param: Required<State>): void;
  openReactionUserList(param: Required<State>): void;
  setFocusedMessage(param?: State): void;
} & State;

type Props = React.PropsWithChildren<{}>;

export const ReactionContext = React.createContext<ReactionContextType | null>(null);
export const ReactionProvider = ({ children }: Props) => {
  const chatContext = useContext(SendbirdChatContext);
  const localizationContext = useContext(LocalizationContext);

  if (!chatContext) throw new Error('ReactionContext: SendbirdChatContext is not provided');
  if (!localizationContext) throw new Error('ReactionContext: LocalizationContext is not provided');

  const [state, setState] = useReducer((prev: State, next: State) => ({ ...prev, ...next }), {});

  const openReactionList: ReactionContextType['openReactionList'] = useCallback((params) => {
    setState(params);
  }, []);
  const openReactionUserList: ReactionContextType['openReactionUserList'] = useCallback((params) => {
    setState(params);
  }, []);
  const setFocusedMessage: ReactionContextType['setFocusedMessage'] = useCallback((params) => {
    if (params) setState(params);
    else setState({});
  }, []);

  return (
    <ReactionContext.Provider
      value={{
        ...state,
        openReactionList,
        openReactionUserList,
        setFocusedMessage,
      }}
    >
      {children}
    </ReactionContext.Provider>
  );
};
