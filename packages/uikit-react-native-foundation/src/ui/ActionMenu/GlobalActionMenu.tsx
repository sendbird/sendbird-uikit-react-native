import React, { useCallback, useContext, useMemo, useState } from 'react';

import type { ActionMenuItem } from './index';
import ActionMenu from './index';

type ActionMenuContextType = {
  open: (params: { title?: string; items: ActionMenuItem[] }) => void;
  close: () => void;
};
const ActionMenuContext = React.createContext<ActionMenuContextType | null>(null);

export const GlobalActionMenu: React.FC = ({ children }) => {
  const [state, setState] = useState<{ title: string; items: ActionMenuItem[] }>({
    title: '',
    items: [],
  });
  const visible = useMemo(() => state.items.length > 0, [state.items]);
  const open: ActionMenuContextType['open'] = useCallback(({ items, title = '' }) => setState({ items, title }), []);
  const close: ActionMenuContextType['close'] = useCallback(() => setState({ title: '', items: [] }), []);

  return (
    <ActionMenuContext.Provider value={{ open, close }}>
      {children}
      <ActionMenu visible={visible} onHide={close} items={state.items} title={state.title} />
    </ActionMenuContext.Provider>
  );
};

export const useActionMenu = () => {
  const context = useContext(ActionMenuContext);
  if (!context) throw new Error('ActionMenuContext is not provided');
  return context;
};
