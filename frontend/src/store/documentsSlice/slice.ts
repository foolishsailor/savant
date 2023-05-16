import { createSlice } from '@reduxjs/toolkit';

import { reducers } from './reducers';
import { initialState } from './state';

const slice = createSlice({
  name: 'documents',
  initialState,
  reducers
});

export const {
  setSelectedCollection,
  setDocuments,
  setCollections,
  setDocumentLightBoxIsOpen,
  setSelectedDocument
} = slice.actions;

const documentsSlice = slice.reducer;

export default documentsSlice;
