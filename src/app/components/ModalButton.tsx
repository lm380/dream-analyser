'use client';

import React, { ReactNode, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { useModal } from '@/contexts/ModalContext';

interface ModalButtonProps {
  children: ReactNode;
  buttonText: string;
  styles?: string;
  wrapperBackground?: string;
}

export const ModalButton = ({
  children,
  buttonText,
  styles,
  wrapperBackground,
}: ModalButtonProps) => {
  const { setShowModal } = useModal();

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className={
          styles
            ? styles
            : 'bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600'
        }
      >
        {buttonText}
      </button>
      <ModalWrapper background={wrapperBackground}>{children}</ModalWrapper>
    </div>
  );
};
