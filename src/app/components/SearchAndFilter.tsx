'use client';

import { Dream } from '@prisma/client';
import React, { ChangeEvent } from 'react';

interface SearchAndFilterProps {
  dreams: Dream[];
  updateDreamList: React.Dispatch<React.SetStateAction<Dream[]>>;
}

export const SearchAndFilter = ({
  dreams,
  updateDreamList,
}: SearchAndFilterProps) => {
  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    updateDreamList(() => {
      return dreams.filter(
        (d: Dream) =>
          d.title
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase()) ||
          d.content
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase()) ||
          d.analysis
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase())
      );
    });
  };
  return (
    <input
      className="mb-5 rounded-sm shadow-sm p-1"
      type="text"
      onChange={inputChangeHandler}
    ></input>
  );
};
