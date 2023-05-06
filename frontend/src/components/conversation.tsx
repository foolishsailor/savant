import { useState } from 'react';
import { Message } from '../types/message';
import { ConversationContainer } from './containers/container.elements';
import { QueryContainer } from './containers/queryContainer';
import Header from './header';
import ConversationList from './lists/conversationList';
import QueryInput from './queryInput';

const Conversation = () => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [systemPrompt, setSystemPrompt] = useState<string>('');

  const systemPromptHandler = (prompt: string) => {
    setSystemPrompt(prompt);
  };

  return (
    <QueryContainer>
      <Header onUpdateSystemPrompt={systemPromptHandler} />
      <ConversationContainer>
        <ConversationList messages={conversation} />
      </ConversationContainer>
      <QueryInput addResponse={setConversation} systemPrompt={systemPrompt} />
    </QueryContainer>
  );
};

export default Conversation;
