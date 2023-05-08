import { PayloadAction } from '@reduxjs/toolkit';
import { DocumentState } from './state';
import { DocumentsObjectInterface } from '../../types/documents';
import { CollectionList } from '../../types/collection';

export const reducers = {
  setSelectedCollection: (
    state: DocumentState,
    action: PayloadAction<CollectionList>
  ) => {
    state.selectedCollection = action.payload;
  },
  setDocuments: (
    state: DocumentState,
    action: PayloadAction<DocumentsObjectInterface[]>
  ) => {
    console.log('setDocuments', action.payload);
    state.documents = action.payload;
  }
};
