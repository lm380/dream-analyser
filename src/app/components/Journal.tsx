'use client';
import React from 'react';
import { DreamCard } from './Card';
import { Dream, User } from '@prisma/client';
import useUser from '@/hooks/useUser';

interface UserWithDreams extends Partial<User> {
  dreams: Dream[];
}

export const Journal = ({ initialUser }: { initialUser: UserWithDreams }) => {
  const { user, isLoading, isError, mutate } = useUser();
  const { name, email, lifeContext, dreams } = user || initialUser;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data</div>;

  return (
    <div className="bg-indigo-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-serif mb-8">Dream History</h1>

      {/* <SearchAndFilter /> */}

      {/* <DreamList /> */}

      {/* <Pagination /> */}

      {dreams.length > 0 && <span>Dreams:</span>}

      <div className="flex flex-wrap gap-4 flex-row max-w-full">
        {dreams.map((dream: Dream) => {
          return (
            <div
              key={dream.id}
              className="rounded-lg w-2/5 border border-gray-600"
            >
              <DreamCard
                title={dream.title}
                content={dream.content}
                analysis={dream.analysis}
                keyElements={dream.keyElements}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
