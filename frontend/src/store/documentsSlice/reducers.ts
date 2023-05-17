import { PayloadAction } from '@reduxjs/toolkit';
import { DocumentState } from './state';
import { DocumentsObject, Document } from '../../types/documents';
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
    action: PayloadAction<DocumentsObject>
  ) => {
    console.log('setDocuments', action.payload);
    state.documents = action.payload;
  },
  setCollections: (
    state: DocumentState,
    action: PayloadAction<CollectionList[]>
  ) => {
    state.collections = action.payload;
  },
  setDocumentLightBoxIsOpen: (
    state: DocumentState,
    action: PayloadAction<boolean>
  ) => {
    state.documentLightBoxIsOpen = action.payload;
  },
  setSelectedDocument: (
    state: DocumentState,
    action: PayloadAction<string>
  ) => {
    state.selectedDocument = action.payload;
  }
};
