import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { CustomLevelsAPI } from '../libs/customLevels/editorApi';

export const useFetchCustomLevelsByAuthor = (initAuthor?: string) => {
  const ref = React.useRef(new CustomLevelsAPI());
  const [error, setError] = React.useState('');
  const [search, setSearch] = React.useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['custom-levels', initAuthor, search],
    enabled: !!initAuthor,
    queryFn: () => ref.current.getCustomLevelsByAuthor(initAuthor!),
    select: (data) => {
      if ('error' in data) {
        console.error(data.error);
        setError(data.error);
        return;
      }
      return data;
    }
  });

  return {
    data,
    isLoading,
    refetch,
    error,
    search,
    setSearch
  };
};
