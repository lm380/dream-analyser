'use client';
import { ModalProvider } from '@/contexts/ModalContext';
import React, { useEffect, useMemo, useState } from 'react';
import { AddContext } from './AddContext';
import { DreamCard } from './Card';
import { ModalButton } from './ModalButton';
import { Dream, User } from '@prisma/client';
import useUser from '@/hooks/useUser';
import { DreamFrequencyChart } from './DreamFrequencyChart';
import { decryptWithUserKey } from '../utils/utilityFuncs';

interface UserWithDreams extends Partial<User> {
  dreams: Dream[];
}

export const Profile = ({ initialUser }: { initialUser: UserWithDreams }) => {
  const { user, isLoading, isError, mutate } = useUser();
  const { name, email, lifeContext, dreams, encryptionKey } =
    user || initialUser;
  const [dreamList, setDreamList] = useState<Dream[]>([]);
  const [isDecryptionError, setIsDecryptionError] = useState(false);

  useEffect(() => {
    const fetchAndDecryptDreams = async () => {
      if (dreams && encryptionKey) {
        try {
          const decryptedDreams = dreams.map((dream: Dream) => {
            try {
              return {
                ...dream,
                content: decryptWithUserKey(dream.content, encryptionKey),
              };
            } catch (error) {
              console.error(`Failed to decrypt dream ID ${dream.id}`, error);
              setIsDecryptionError(true);
              return dream; // Return the original dream if decryption fails
            }
          });
          setDreamList(decryptedDreams);
        } catch (error) {
          console.error('Error decrypting dreams:', error);
          setIsDecryptionError(true);
        }
      }
    };

    fetchAndDecryptDreams();
  }, [dreams, encryptionKey]);

  const newestDreams = useMemo(() => {
    return [...dreamList].reverse().slice(0, 4);
  }, [dreamList]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading user data
      </div>
    );
  if (isDecryptionError)
    return <div>Error decrypting dreams. Some content may be missing.</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-8 md:p-16 lg:p-20">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm sm:text-base md:text-lg lg:text-xl">
        <div className="flex flex-row w-full">
          <p className="text-xl sm:text-2xl md:text-3xl">Welcome {name}!</p>
        </div>
        <div className="content w-full mt-[5%]">
          <DreamFrequencyChart dreams={dreams} />
          {/* <WordCloudComponent dreams={dreams} /> */}
          {email && (
            <ModalProvider>
              <ModalButton buttonText={'Add Context?'}>
                <AddContext email={email} currentContext={lifeContext || ''} />
              </ModalButton>
            </ModalProvider>
          )}
          <br />

          {dreams.length > 0 && <span>Recent Dreams:</span>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {newestDreams.map((dream: Dream) => {
              return (
                <div
                  key={dream.id}
                  className="rounded-lg border border-gray-600"
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
