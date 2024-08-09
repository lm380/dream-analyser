'use client';
import React, { ChangeEvent, useState } from 'react';
import { Dream, User } from '@prisma/client';
import useUser from '@/hooks/useUser';
import { LazyDreamList } from './LazyDreamsList';
import { SearchAndFilter } from './SearchAndFilter';

interface UserWithDreams extends Partial<User> {
  dreams: Dream[];
}

export const Journal = ({ initialUser }: { initialUser: UserWithDreams }) => {
  const { user, isLoading, isError, mutate } = useUser();
  const { dreams } = user || initialUser;
  const [dreamList, setDreamList] = useState<Dream[]>(dreams);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data</div>;

  return (
    <div className="bg-indigo-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-serif mb-8">Dream History</h1>
      <SearchAndFilter dreams={dreams} updateDreamList={setDreamList} />

      <LazyDreamList dreams={dreamList} />
    </div>
  );
};
