import { ConversationContainer } from './containers/container.elements';
import { QueryContainer } from './containers/container.elements';
import ConversationList from './lists/conversationList';
import ConversationSettingsMenu from './menus/conversationSettingsMenu';
import QueryInput from './queryInput';

const Conversation = () => {
  return (
    <QueryContainer>
      <ConversationContainer>
        <ConversationList />
      </ConversationContainer>
      <QueryInput />
      <ConversationSettingsMenu />
    </QueryContainer>
  );
};

export default Conversation;
