'use client';

import React, { ReactNode, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { useModal } from '@/contexts/ModalContext';

export const ModalButton = ({
  children,
  buttonText,
}: {
  children: ReactNode;
  buttonText: string;
}) => {
  const { setShowModal } = useModal();

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        {buttonText}
      </button>
      <ModalWrapper>{children}</ModalWrapper>
    </div>
  );
};
