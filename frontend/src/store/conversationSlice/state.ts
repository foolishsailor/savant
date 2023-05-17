import { Message } from '../../types/message';

export interface ConversationState {
  systemPrompt: string;
  conversation: Message[];
}

export const initialState: ConversationState = {
  systemPrompt: '',
  conversation: []
};
