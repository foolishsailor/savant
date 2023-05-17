import { PayloadAction } from '@reduxjs/toolkit';
import { ConversationState } from './state';

import { Message } from '../../types/message';

export const reducers = {
  setSystemPrompt: (
    state: ConversationState,
    action: PayloadAction<string>
  ) => {
    state.systemPrompt = action.payload;
  },
  setConversation: (
    state: ConversationState,
    action: PayloadAction<Message[]>
  ) => {
    state.conversation = action.payload;
  },
  addToConversation: (
    state: ConversationState,
    action: PayloadAction<Message[]>
  ) => {
    state.conversation = [...state.conversation, ...action.payload];
  }
};
