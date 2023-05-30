import { DocumentsObject } from '../../types/documents';
import { CollectionList } from '../../types/collection';

export interface DocumentState {
  documentLightBoxIsOpen: boolean;
  selectedDocument: string | undefined;
  selectedCollection: CollectionList;
  collections: CollectionList[];
  documents: DocumentsObject | undefined;
}

export const initialState: DocumentState = {
  documentLightBoxIsOpen: false,
  selectedDocument: undefined,
  selectedCollection: {
    name: '',
    metadata: {}
  },
  collections: [],
  documents: undefined
};
