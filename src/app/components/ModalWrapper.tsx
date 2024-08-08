import { useModal } from '@/contexts/ModalContext';
import React, { ReactNode, useRef } from 'react';

interface ModalWrapperProps {
  children: ReactNode;
  background?: string;
}

export default function ModalWrapper({
  children,
  background,
}: ModalWrapperProps) {
  const { showModal, setShowModal } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);
  if (!showModal) return null;

  const closeModal = () => {
    setShowModal(false);
  };

  const closeOnClickAway = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 bottom-0 right-0 bg-black/[0.5] flex justify-center items-center"
      onClick={closeOnClickAway}
    >
      <div
        ref={modalRef}
        className={`${
          background ? background : 'bg-white'
        } p-5 rounded-lg relative shadow-lg w-10/12`}
      >
        <button
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
