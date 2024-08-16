'use client';
import React, { useEffect, useState } from 'react';
import { Dream, User } from '@prisma/client';
import useUser from '@/hooks/useUser';
import { LazyDreamList } from './LazyDreamsList';
import { SearchAndFilter } from './SearchAndFilter';
import { decryptWithUserKey } from '../utils/utilityFuncs';

interface UserWithDreams extends Partial<User> {
  dreams: Dream[];
}

export const Journal = ({ initialUser }: { initialUser: UserWithDreams }) => {
  const { user, isLoading, isError } = useUser();
  const [dreamList, setDreamList] = useState<Dream[]>([]);
  const [isDecryptionError, setIsDecryptionError] = useState(false);

  const { dreams, encryptionKey } = user || initialUser;

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data</div>;
  if (isDecryptionError)
    return <div>Error decrypting dreams. Some content may be missing.</div>;

  return (
    <div className="bg-indigo-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-serif mb-8">Dream History</h1>
      <SearchAndFilter dreams={dreamList} updateDreamList={setDreamList} />
      <LazyDreamList dreams={dreamList} />
    </div>
  );
};
