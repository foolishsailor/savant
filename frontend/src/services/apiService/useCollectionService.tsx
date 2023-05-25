import { useCallback } from 'react';

import { useFetch } from 'hooks/useFetch';
import { CollectionList } from 'types/collection';

const useCollectionService = () => {
  const fetchService = useFetch();

  const addCollection = useCallback(
    (collectionName: string, signal?: AbortSignal) => {
      return fetchService.post<CollectionList[]>(`/collections`, {
        body: { collectionName },
        headers: {
          'Content-Type': 'application/json'
        },
        signal
      });
    },
    [fetchService]
  );

  const deleteCollection = useCallback(
    (collectionName: string, signal?: AbortSignal) => {
      return fetchService.post<CollectionList[]>(`/collections`, {
        body: { collectionName },
        headers: {
          'Content-Type': 'application/json'
        },
        signal
      });
    },
    [fetchService]
  );

  return {
    addCollection,
    deleteCollection
  };
};

export default useCollectionService;
