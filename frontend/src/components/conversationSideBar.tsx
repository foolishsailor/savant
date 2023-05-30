import { SidebarContainer, SidebarItem } from './containers/container.elements';
import { ConversationSidebarSettingsList } from './lists/conversationSidebarSettingsList';

const ConversationSideBar = () => {
  return (
    <SidebarContainer sx={{ maxHeight: 'calc(100vh - 64px)' }}>
      <SidebarItem />
      <ConversationSidebarSettingsList />
    </SidebarContainer>
  );
};

export default ConversationSideBar;
