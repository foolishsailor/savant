import { Message } from '../../types/message';

export interface ConversationState {
  systemPrompt: string;
  conversation: Message[];
  temperature: number;
  documentRetrievalType: 'simple' | 'refine';
}

export const initialState: ConversationState = {
  systemPrompt: '',
  conversation: [],
  temperature: 0.5,
  documentRetrievalType: 'simple'
};
