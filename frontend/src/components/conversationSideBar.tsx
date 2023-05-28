import { SidebarSettingsList } from './lists/sidebarSettingsList';
import { SidebarContainer, SidebarItem } from './containers/container.elements';

const ConversationSideBar = () => {
  return (
    <SidebarContainer sx={{ maxHeight: 'calc(100vh - 64px)' }}>
      <SidebarItem />
      <SidebarSettingsList />
    </SidebarContainer>
  );
};

export default ConversationSideBar;
