import { DocumentSidebarSettingsList } from './lists/documentSidebarSettingsList';
import { SidebarContainer } from './containers/container.elements';
import DocumentsList from './lists/documentList';
import CollectionList from './lists/collectionList';

const DocumentSideBar = () => {
  return (
    <SidebarContainer>
      <CollectionList />
      <DocumentsList />
      <DocumentSidebarSettingsList />
    </SidebarContainer>
  );
};

export default DocumentSideBar;
