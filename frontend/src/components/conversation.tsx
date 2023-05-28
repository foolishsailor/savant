import { ConversationContainer } from './containers/container.elements';
import { QueryContainer } from './containers/container.elements';
import ConversationList from './lists/conversationList';
import QueryInput from './queryInput';

const Conversation = () => {
  return (
    <QueryContainer>
      <ConversationContainer>
        <ConversationList />
      </ConversationContainer>
      <QueryInput />
    </QueryContainer>
  );
};

export default Conversation;
