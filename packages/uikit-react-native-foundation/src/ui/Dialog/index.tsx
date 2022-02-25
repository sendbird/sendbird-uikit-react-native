import React, { useCallback, useContext, useRef } from 'react';

import { useForceUpdate } from '@sendbird/uikit-utils';

import type { ActionMenuItem } from '../ActionMenu';
import ActionMenu from '../ActionMenu';
import type { AlertItem } from '../Alert';
import Alert from '../Alert';

type JobInterface =
  | {
      type: 'ActionMenu';
      props: {
        title?: string;
        items: ActionMenuItem[];
      };
    }
  | {
      type: 'Alert';
      props: AlertItem;
    };

type SelectJobProps<T extends JobInterface['type'], U extends JobInterface = JobInterface> = U extends { type: T }
  ? U['props']
  : never;

type DialogContextType = {
  alert: (props: SelectJobProps<'Alert'>) => void;
  openMenu: (props: SelectJobProps<'ActionMenu'>) => void;
};
const DialogContext = React.createContext<DialogContextType | null>(null);

export const DialogProvider: React.FC = ({ children }) => {
  const render = useForceUpdate();

  const queue = useRef<JobInterface[]>([]);
  const workingJob = useRef<JobInterface>();
  const visibleState = useRef(false);

  const isProcessing = () => Boolean(workingJob.current);
  const updateToShow = useCallback(() => {
    visibleState.current = true;
    render();
  }, []);
  const updateToHide = useCallback(() => {
    visibleState.current = false;
    render();
  }, []);

  const consumeQueue = useCallback(() => {
    const job = queue.current.shift();
    if (job) {
      workingJob.current = job;
      updateToShow();
    } else {
      workingJob.current = undefined;
    }
  }, []);

  const createJob =
    <T extends JobInterface['type']>(type: T) =>
    (props: SelectJobProps<T>) => {
      const jobItem = { type, props } as JobInterface;
      if (isProcessing()) queue.current.push(jobItem);
      else {
        workingJob.current = jobItem;
        updateToShow();
      }
    };

  const alert = useCallback(createJob('Alert'), []);
  const openMenu = useCallback(createJob('ActionMenu'), []);

  return (
    <DialogContext.Provider value={{ alert, openMenu }}>
      {children}
      {workingJob.current?.type === 'ActionMenu' && (
        <ActionMenu
          onDismiss={consumeQueue}
          visible={visibleState.current}
          onHide={updateToHide}
          title={workingJob.current.props.title}
          items={workingJob.current.props.items}
        />
      )}
      {workingJob.current?.type === 'Alert' && (
        <Alert
          onDismiss={consumeQueue}
          visible={visibleState.current}
          onHide={updateToHide}
          title={workingJob.current.props.title}
          message={workingJob.current.props.message}
          buttons={workingJob.current.props.buttons}
        />
      )}
    </DialogContext.Provider>
  );
};
export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogProvider is not provided');
  return context;
};
export const useAlert = () => {
  const { alert } = useDialog();
  return { alert };
};
export const useActionMenu = () => {
  const { openMenu } = useDialog();
  return { show: openMenu };
};
