import { createSlice } from '@reduxjs/toolkit';

import { reducers } from './reducers';
import { initialState } from './state';

const slice = createSlice({
  name: 'conversation',
  initialState,
  reducers
});

export const {
  setSystemPrompt,
  setConversation,
  addToConversation,
  setTemperature,
  setDocumentRetrievalType,
  setModel
} = slice.actions;

const conversationSlice = slice.reducer;

export default conversationSlice;
