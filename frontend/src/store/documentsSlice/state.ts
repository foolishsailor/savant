import { DocumentsObject } from '../../types/documents';
import { CollectionList } from '../../types/collection';

export interface DocumentState {
  documentLightBoxIsOpen: boolean;
  documentLightBoxOnClose: () => void;
  selectedDocument: string | undefined;
  selectedCollection: CollectionList;
  collections: CollectionList[];
  documents: DocumentsObject | undefined;
}

export const initialState: DocumentState = {
  documentLightBoxIsOpen: false,
  documentLightBoxOnClose: () => {},
  selectedDocument: undefined,
  selectedCollection: {
    name: '',
    metadata: {}
  },
  collections: [],
  documents: undefined
};
