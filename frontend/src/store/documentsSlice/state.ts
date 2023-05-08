import { DocumentsObjectInterface } from '../../types/documents';
import { Message } from '../../types/message';
import { CollectionList } from '../../types/collection';

export interface DocumentState {
  selectedCollection: CollectionList;
  collections: Message[];
  documents: DocumentsObjectInterface[];
}

export const initialState: DocumentState = {
  selectedCollection: {
    name: '',
    metadata: {}
  },
  collections: [],
  documents: []
};
