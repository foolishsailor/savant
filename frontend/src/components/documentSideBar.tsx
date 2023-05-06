import { SidebarSettingsList } from './lists/sidebarSettingsList';
import { SidebarContainer } from './containers/container.elements';
import DocumentsList from './lists/documentList';
import CollectionList from './lists/collectionList';

const DocumentSideBar = () => {
  return (
    <SidebarContainer>
      <CollectionList />
      <DocumentsList />
      <SidebarSettingsList />
    </SidebarContainer>
  );
};

export default DocumentSideBar;
