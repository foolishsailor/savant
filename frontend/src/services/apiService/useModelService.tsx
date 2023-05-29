import { useCallback } from 'react';

import { useFetch } from 'hooks/useFetch';

const useModelService = () => {
  const fetchService = useFetch();

  const getModels = useCallback(
    (signal?: AbortSignal) => {
      return fetchService.get<any>(`/models`, {
        signal
      });
    },
    [fetchService]
  );

  return {
    getModels
  };
};

export default useModelService;
