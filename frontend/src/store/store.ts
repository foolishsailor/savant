import { configureStore } from '@reduxjs/toolkit';

import conversationSlice from './conversationSlice/slice';
import documentsSlice from './documentsSlice/slice';

const store = configureStore({
  reducer: {
    conversation: conversationSlice,
    documents: documentsSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
