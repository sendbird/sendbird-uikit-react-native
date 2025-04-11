import type * as NewDocumentsPicker from '@react-native-documents/picker';
import type * as OldDocumentPicker from 'react-native-document-picker';

import { Logger } from '@sendbird/uikit-utils';

import SBUError from '../libs/SBUError';
import normalizeFile from '../utils/normalizeFile';
import type { FilePickerResponse, OpenDocumentOptions } from './types';

export type DocumentPicker = typeof OldDocumentPicker | typeof NewDocumentsPicker;

async function openDocumentByOldDocumentPicker(
  documentPickerModule: typeof OldDocumentPicker,
  options?: OpenDocumentOptions,
): Promise<FilePickerResponse> {
  Logger.warn('please update to @react-native-documents/picker');
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

function isOldModule(documentPicker: DocumentPicker): documentPicker is typeof OldDocumentPicker {
  return 'pickSingle' in documentPicker && typeof documentPicker.pickSingle === 'function';
}

export async function openDocument(
  documentPickerModule: DocumentPicker,
  options?: OpenDocumentOptions,
): Promise<FilePickerResponse> {
  if (isOldModule(documentPickerModule)) {
    return await openDocumentByOldDocumentPicker(documentPickerModule, options);
  }
  return await openDocumentByNewDocumentsPicker(documentPickerModule, options);
}
