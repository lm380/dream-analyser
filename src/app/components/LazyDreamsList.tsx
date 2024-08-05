import { useState, useEffect } from 'react';
import { Dream } from '@prisma/client';
import { DreamCard } from './Card';

export const LazyDreamList = ({ dreams }: { dreams: Dream[] }) => {
  const [visibleDreams, setVisibleDreams] = useState<Dream[]>([]);
  const [page, setPage] = useState(1);
  const dreamsPerPage = 6;

  useEffect(() => {
    setVisibleDreams(dreams.slice(0, page * dreamsPerPage));
  }, [dreams, page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleDreams.map((dream: Dream) => (
          <div key={dream.id} className="rounded-lg border border-gray-600">
            <DreamCard
              title={dream.title}
              content={dream.content}
              analysis={dream.analysis}
              keyElements={dream.keyElements}
            />
          </div>
        ))}
      </div>
      {visibleDreams.length < dreams.length && (
        <button
          onClick={loadMore}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-700"
        >
          Load More
        </button>
      )}
    </div>
  );
};
