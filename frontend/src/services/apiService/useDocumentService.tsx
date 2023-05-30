import { useCallback } from 'react';

import { useFetch } from 'hooks/useFetch';
import { CollectionList } from 'types/collection';
import { DocumentsObject, DocumentLoaderErrors } from 'types/documents';

export interface AddDocumentsReturnType {
  documents: DocumentsObject;
  errors: DocumentLoaderErrors[];
}

export interface DeleteDocumentType {
  collectionName: string;
  fileName: string;
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

  const deleteDocument = useCallback(
    (body: DeleteDocumentType, signal?: AbortSignal) => {
      return fetchService.post<DocumentsObject>(`/documents/delete`, {
        body,
        signal
      });
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
    deleteDocument
  };
};

export default useDocumentService;
