import { Message } from 'types/message';
import { OpenAiModels } from 'types/models';

export interface ConversationState {
  systemPrompt: string;
  conversation: Message[];
  temperature: number;
  documentRetrievalType: 'simple' | 'refine';
  model: OpenAiModels;
}

export const initialState: ConversationState = {
  systemPrompt: '',
  conversation: [],
  temperature: 0.5,
  documentRetrievalType: 'simple',
  model:
    (process.env.REACT_APP_DEFAULT_MODEL as OpenAiModels) || 'gpt-3.5-turbo'
};
