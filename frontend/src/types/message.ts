export interface Message {
  source: 'assistant' | 'user';
  content: string[];
}
