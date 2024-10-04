import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { CustomLevelsAPI } from '../libs/customLevels/editorApi';

export const useFetchCustomLevels = () => {
  const ref = React.useRef(new CustomLevelsAPI());
  const [error, setError] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['custom-levels', search, page],
    queryFn: () => ref.current.getCustomLevels(page),
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
    setSearch,
    page,
    setPage
  };
};
