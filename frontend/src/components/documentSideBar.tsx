import { SidebarSettingsList } from './lists/sidebarSettingsList';
import { SidebarContainer } from './containers/container.elements';
import DocumentsList from './lists/documentList';
import CollectionList from './lists/collectionList';

const DocumentSideBar = () => {
  return (
    <SidebarContainer sx={{ maxHeight: 'calc(100vh - 64px)' }}>
      <CollectionList />
      <DocumentsList />
      <SidebarSettingsList />
    </SidebarContainer>
  );
};

export default DocumentSideBar;
