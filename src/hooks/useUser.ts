// src/hooks/useUser.ts

import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

const useUser = () => {
  const { data, error, mutate } = useSWR('/api/user', fetcher);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default useUser;
