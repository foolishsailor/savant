import { SidebarSettingsList } from './lists/sidebarSettingsList';
import { SidebarContainer } from './containers/container.elements';
import DocumentsList from './lists/documentList';
import CollectionList from './lists/collectionList';
import { useState } from 'react';
import { DocumentsObjectInterface } from '../types/documents';
import { CollectionList as CollectionListType } from '../types/collection';

const DocumentSideBar = () => {
  const [documents, setDocuments] = useState<DocumentsObjectInterface[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionListType>();

  const handleSelectedCollection = (collection: CollectionListType) => {
    setSelectedCollection(collection);
  };

  const handeDocuments = (documents: DocumentsObjectInterface[]) => {
    console.log('DocumentsList', documents);
    setDocuments(documents);
  };

  return (
    <SidebarContainer sx={{ maxHeight: 'calc(100vh - 64px)' }}>
      <CollectionList
        selectedCollection={selectedCollection}
        handleSelectedCollection={handleSelectedCollection}
        documentHandler={handeDocuments}
      />
      <DocumentsList
        selectedCollection={selectedCollection}
        documents={documents}
        documentHandler={handeDocuments}
      />
      <SidebarSettingsList />
    </SidebarContainer>
  );
};

export default DocumentSideBar;
