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

type DialogPropsBy<T extends DialogJob['type'], U extends DialogJob = DialogJob> = U extends { type: T }
  ? U['props']
  : never;

type DialogContextType = {
  openMenu: (props: DialogPropsBy<'ActionMenu'>) => void;
  alert: (props: DialogPropsBy<'Alert'>) => void;
  prompt: (props: DialogPropsBy<'Prompt'>) => void;
  openSheet: (props: DialogPropsBy<'BottomSheet'>) => void;
};

const ActionMenuContext = React.createContext<Pick<DialogContextType, 'openMenu'> | null>(null);
const AlertContext = React.createContext<Pick<DialogContextType, 'alert'> | null>(null);
const PromptContext = React.createContext<Pick<DialogContextType, 'prompt'> | null>(null);
const BottomSheetContext = React.createContext<Pick<DialogContextType, 'openSheet'> | null>(null);

export const DialogProvider: React.FC = ({ children }) => {
  const render = useForceUpdate();

  const dialogQueue = useRef<DialogJob[]>([]);
  const workingDialogJob = useRef<DialogJob>();
  const visibleState = useRef(false);

  const isProcessing = () => Boolean(workingDialogJob.current);
  const updateToShow = useCallback(() => {
    visibleState.current = true;
    render();
  }, []);
  const updateToHide = useCallback(() => {
    visibleState.current = false;
    render();
  }, []);
  const consumeQueue = useCallback(() => {
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

  const openMenu = useCallback(createJob('ActionMenu'), []);
  const alert = useCallback(createJob('Alert'), []);
  const prompt = useCallback(createJob('Prompt'), []);
  const openSheet = useCallback(createJob('BottomSheet'), []);

  return (
    <AlertContext.Provider value={{ alert }}>
      <ActionMenuContext.Provider value={{ openMenu }}>
        <PromptContext.Provider value={{ prompt }}>
          <BottomSheetContext.Provider value={{ openSheet }}>
            {children}
            {workingDialogJob.current?.type === 'ActionMenu' && (
              <ActionMenu
                onDismiss={consumeQueue}
                visible={visibleState.current}
                onHide={updateToHide}
                title={workingDialogJob.current.props.title}
                menuItems={workingDialogJob.current.props.menuItems}
              />
            )}
            {workingDialogJob.current?.type === 'Alert' && (
              <Alert
                onDismiss={consumeQueue}
                visible={visibleState.current}
                onHide={updateToHide}
                title={workingDialogJob.current.props.title}
                message={workingDialogJob.current.props.message}
                buttons={workingDialogJob.current.props.buttons}
              />
            )}
            {workingDialogJob.current?.type === 'Prompt' && (
              <Prompt
                onDismiss={consumeQueue}
                visible={visibleState.current}
                onHide={updateToHide}
                title={workingDialogJob.current.props.title}
                placeholder={workingDialogJob.current.props.placeholder}
                onSubmit={workingDialogJob.current.props.onSubmit}
                submitLabel={workingDialogJob.current.props.submitLabel}
                cancelLabel={workingDialogJob.current.props.cancelLabel}
              />
            )}
            {workingDialogJob.current?.type === 'BottomSheet' && (
              <BottomSheet
                onDismiss={consumeQueue}
                visible={visibleState.current}
                onHide={updateToHide}
                sheetItems={workingDialogJob.current.props.sheetItems}
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
  if (!context) throw new Error('ActionMenuContext is not provided');
  return context;
};
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('AlertContext is not provided');
  return context;
};
export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) throw new Error('PromptContext is not provided');
  return context;
};
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) throw new Error('BottomSheetContext is not provided');
  return context;
};
