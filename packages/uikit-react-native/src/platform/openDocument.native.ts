import type * as NewDocumentsPicker from '@react-native-documents/picker';
import type * as OldDocumentPicker from 'react-native-document-picker';

import type { FilePickerResponse, OpenDocumentOptions } from '@sendbird/uikit-react-native';
import { Logger } from '@sendbird/uikit-utils';

import SBUError from '../libs/SBUError';
import normalizeFile from '../utils/normalizeFile';

export type DocumentPicker = typeof OldDocumentPicker | typeof NewDocumentsPicker;

async function openDocumentByOldDocumentPicker(
  documentPickerModule: typeof OldDocumentPicker,
  options?: OpenDocumentOptions,
): Promise<FilePickerResponse> {
  Logger.log('called openDocumentByOldDocumentPicker');
  try {
    const { uri, size, name, type } = await documentPickerModule.pickSingle();
    return normalizeFile({ uri, size, name, type });
  } catch (e) {
    if (!documentPickerModule.isCancel(e) && documentPickerModule.isInProgress(e)) {
      options?.onOpenFailure?.(SBUError.UNKNOWN, e);
    }
    return null;
  }
}

async function openDocumentByNewDocumentsPicker(
  documentPickerModule: typeof NewDocumentsPicker,
  options?: OpenDocumentOptions,
): Promise<FilePickerResponse> {
  Logger.log('called openDocumentByNewDocumentsPicker');
  try {
    const results = await documentPickerModule.pick();
    const { uri, size, name, type } = results[0];
    return normalizeFile({ uri, size, name, type });
  } catch (e) {
    if (
      !documentPickerModule.isErrorWithCode(documentPickerModule.errorCodes.OPERATION_CANCELED) &&
      documentPickerModule.isErrorWithCode(documentPickerModule.errorCodes.IN_PROGRESS)
    ) {
      options?.onOpenFailure?.(SBUError.UNKNOWN, e);
    }
    return null;
  }
}

export async function openDocument(
  documentPickerModule: DocumentPicker,
  options?: OpenDocumentOptions,
): Promise<FilePickerResponse> {
  let oldDocumentPicker: typeof OldDocumentPicker | undefined;
  let newDocumentsPicker: typeof NewDocumentsPicker | undefined;

  try {
    oldDocumentPicker = require('react-native-document-picker') as typeof OldDocumentPicker;
  } catch {}

  try {
    newDocumentsPicker = require('@react-native-documents/picker') as typeof NewDocumentsPicker;
  } catch {}

  if (newDocumentsPicker && documentPickerModule === newDocumentsPicker) {
    return await openDocumentByNewDocumentsPicker(documentPickerModule, options);
  } else if (oldDocumentPicker && documentPickerModule === oldDocumentPicker) {
    return await openDocumentByOldDocumentPicker(documentPickerModule, options);
  } else {
    const errorMessage =
      'Document picker module not found. Please install either react-native-document-picker or @react-native-documents/picker.';
    Logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
