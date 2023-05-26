import { useCallback } from 'react';

import { useFetch } from 'hooks/useFetch';
import { CollectionList } from 'types/collection';
import { DocumentsObject, DocumentLoaderErrors } from 'types/documents';

export interface AddDocumentsReturnType {
  documents: DocumentsObject;
  errors: DocumentLoaderErrors[];
}

const useDocumentService = () => {
  const fetchService = useFetch();

  const addDocuments = useCallback(
    (files: FormData, signal?: AbortSignal) => {
      return fetchService.post<AddDocumentsReturnType>(`/documents`, {
        body: files,
        signal
      });
    },
    [fetchService]
  );

  const deleteCollection = useCallback(
    (collectionName: string, signal?: AbortSignal) => {
      return fetchService.delete<CollectionList[]>(
        `/collections/${collectionName}`,
        {
          signal
        }
      );
    },
    [fetchService]
  );

  const getAllDocuments = useCallback(
    (signal?: AbortSignal) => {
      return fetchService.get<DocumentsObject>(`/documents`, {
        signal
      });
    },
    [fetchService]
  );

  const getDocuments = useCallback(
    (collectionName: string, signal?: AbortSignal) => {
      return fetchService.get<DocumentsObject>(
        `/documents?collectionName=${collectionName}`,
        {
          signal
        }
      );
    },
    [fetchService]
  );

  return {
    addDocuments,
    getDocuments,
    getAllDocuments,
    deleteCollection
  };
};

export default useDocumentService;
