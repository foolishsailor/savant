import { ConversationContainer } from './containers/container.elements';
import { QueryContainer } from './containers/container.elements';
import Header from './header';
import ConversationList from './lists/conversationList';
import QueryInput from './queryInput';

const Conversation = () => {
  return (
    <QueryContainer>
      <Header />
      <ConversationContainer>
        <ConversationList />
      </ConversationContainer>
      <QueryInput />
    </QueryContainer>
  );
};

export default Conversation;
