'use client';
import { ModalProvider } from '@/contexts/ModalContext';
import React from 'react';
import { AddContext } from './AddContext';
import { DreamCard } from './Card';
import { ModalButton } from './ModalButton';
import { Dream, User } from '@prisma/client';
import useUser from '@/hooks/useUser';
import { DreamFrequencyChart } from './DreamFrequencyChart';
import { WordCloudComponent } from './WordCloud';

interface UserWithDreams extends Partial<User> {
  dreams: Dream[];
}

export const Profile = ({ initialUser }: { initialUser: UserWithDreams }) => {
  const { user, isLoading, isError, mutate } = useUser();
  const { name, email, lifeContext, dreams } = user || initialUser;

  const ascendingDreams = dreams.reverse();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-xl lg:flex flex-col">
        <div className="flex flex-row w-full">
          <p className="text-3xl">Welcome {name}!</p>
        </div>
        <div className="content w-full mt-[5%]">
          <DreamFrequencyChart dreams={ascendingDreams} />
          {/* <WordCloudComponent dreams={dreams} /> */}
          {email && (
            <ModalProvider>
              <ModalButton buttonText={'Add Context?'}>
                <AddContext email={email} currentContext={lifeContext || ''} />
              </ModalButton>
            </ModalProvider>
          )}
          <br />

          {dreams.length > 0 && <span>Dreams:</span>}

          <div className="flex flex-wrap gap-4 flex-row max-w-full">
            {dreams.slice(0, 4).map((dream: Dream) => {
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
      </div>
    </main>
  );
};
