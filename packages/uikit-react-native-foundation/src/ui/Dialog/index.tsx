import React, { useCallback, useContext, useRef } from 'react';

import { useForceUpdate } from '@sendbird/uikit-utils';

import type { ActionMenuItem } from '../ActionMenu';
import ActionMenu from '../ActionMenu';
import type { AlertItem } from '../Alert';
import Alert from '../Alert';
import type { BottomSheetItem } from '../BottomSheet';
import BottomSheet from '../BottomSheet';
import type { PromptItem } from '../Prompt';
import Prompt from '../Prompt';

type DialogJob =
  | {
      type: 'ActionMenu';
      props: ActionMenuItem;
    }
  | {
      type: 'Alert';
      props: AlertItem;
    }
  | {
      type: 'Prompt';
      props: PromptItem;
    }
  | {
      type: 'BottomSheet';
      props: BottomSheetItem;
    };

type DialogPropsBy<T extends DialogJob['type'], U extends DialogJob = DialogJob> = U extends { type: T; props: infer P }
  ? P
  : never;

type DialogContextType = {
  openMenu: (props: DialogPropsBy<'ActionMenu'>) => void;
  alert: (props: DialogPropsBy<'Alert'>) => void;
  openPrompt: (props: DialogPropsBy<'Prompt'>) => void;
  openSheet: (props: DialogPropsBy<'BottomSheet'>) => void;
};

const AlertContext = React.createContext<Pick<DialogContextType, 'alert'> | null>(null);
const ActionMenuContext = React.createContext<Pick<DialogContextType, 'openMenu'> | null>(null);
const PromptContext = React.createContext<Pick<DialogContextType, 'openPrompt'> | null>(null);
const BottomSheetContext = React.createContext<Pick<DialogContextType, 'openSheet'> | null>(null);

type Props = React.PropsWithChildren<{
  defaultLabels?: {
    alert?: { ok?: string };
    prompt?: { placeholder?: string; ok?: string; cancel?: string };
  };
}>;
const DISMISS_TIMEOUT = 3000;
export const DialogProvider = ({ defaultLabels, children }: Props) => {
  const waitDismissTimeout = useRef<NodeJS.Timeout>();
  const waitDismissPromise = useRef<() => void>();
  const waitDismiss = useCallback((resolver: () => void) => {
    waitDismissPromise.current = resolver;
    waitDismissTimeout.current = setTimeout(completeDismiss, DISMISS_TIMEOUT);
  }, []);
  const completeDismiss = useCallback(() => {
    if (waitDismissTimeout.current) clearTimeout(waitDismissTimeout.current);
    if (waitDismissPromise.current) waitDismissPromise.current();
    waitDismissTimeout.current = undefined;
    waitDismissPromise.current = undefined;
  }, []);

  const render = useForceUpdate();
  const dialogQueue = useRef<DialogJob[]>([]);
  const workingDialogJob = useRef<DialogJob>();
  const visibleState = useRef(false);

  const isProcessing = () => Boolean(workingDialogJob.current);
  const updateToShow = useCallback(() => {
    visibleState.current = true;
    render();
  }, []);
  const updateToHide = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      visibleState.current = false;
      render();
      waitDismiss(resolve);
    });
  }, []);
  const consumeQueue = useCallback(() => {
    completeDismiss();
    const job = dialogQueue.current.shift();
    if (job) {
      workingDialogJob.current = job;
      updateToShow();
    } else {
      workingDialogJob.current = undefined;
    }
  }, []);

  const createJob =
    <T extends DialogJob['type']>(type: T) =>
    (props: DialogPropsBy<T>) => {
      const jobItem = { type, props } as DialogJob;
      if (isProcessing()) dialogQueue.current.push(jobItem);
      else {
        workingDialogJob.current = jobItem;
        updateToShow();
      }
    };

  const alert = useCallback(createJob('Alert'), []);
  const openMenu = useCallback(createJob('ActionMenu'), []);
  const openPrompt = useCallback(createJob('Prompt'), []);
  const openSheet = useCallback(createJob('BottomSheet'), []);

  return (
    <AlertContext.Provider value={{ alert }}>
      <ActionMenuContext.Provider value={{ openMenu }}>
        <PromptContext.Provider value={{ openPrompt }}>
          <BottomSheetContext.Provider value={{ openSheet }}>
            {children}
            {workingDialogJob.current?.type === 'ActionMenu' && (
              <ActionMenu
                onHide={updateToHide}
                onDismiss={consumeQueue}
                visible={visibleState.current}
                title={workingDialogJob.current.props.title}
                menuItems={workingDialogJob.current.props.menuItems}
              />
            )}
            {workingDialogJob.current?.type === 'Alert' && (
              <Alert
                onHide={updateToHide}
                onDismiss={consumeQueue}
                visible={visibleState.current}
                title={workingDialogJob.current.props.title}
                message={workingDialogJob.current.props.message}
                buttons={workingDialogJob.current.props.buttons ?? [{ text: defaultLabels?.alert?.ok || 'OK' }]}
              />
            )}
            {workingDialogJob.current?.type === 'Prompt' && (
              <Prompt
                onHide={updateToHide}
                onDismiss={consumeQueue}
                visible={visibleState.current}
                title={workingDialogJob.current.props.title}
                onSubmit={workingDialogJob.current.props.onSubmit}
                defaultValue={workingDialogJob.current.props.defaultValue}
                submitLabel={workingDialogJob.current.props.submitLabel ?? defaultLabels?.prompt?.ok}
                cancelLabel={workingDialogJob.current.props.cancelLabel ?? defaultLabels?.prompt?.cancel}
                placeholder={workingDialogJob.current.props.placeholder ?? defaultLabels?.prompt?.placeholder}
              />
            )}
            {workingDialogJob.current?.type === 'BottomSheet' && (
              <BottomSheet
                onHide={updateToHide}
                onDismiss={consumeQueue}
                visible={visibleState.current}
                sheetItems={workingDialogJob.current.props.sheetItems}
                HeaderComponent={workingDialogJob.current.props.HeaderComponent}
              />
            )}
          </BottomSheetContext.Provider>
        </PromptContext.Provider>
      </ActionMenuContext.Provider>
    </AlertContext.Provider>
  );
};

export const useActionMenu = () => {
  const context = useContext(ActionMenuContext);
  if (!context) throw new Error('ActionMenuContext is not provided, wrap your app with DialogProvider');
  return context;
};
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('AlertContext is not provided, wrap your app with DialogProvider');
  return context;
};
export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) throw new Error('PromptContext is not provided, wrap your app with DialogProvider');
  return context;
};
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) throw new Error('BottomSheetContext is not provided, wrap your app with DialogProvider');
  return context;
};
