import { useModal } from '@/contexts/ModalContext';
import React, { ReactNode } from 'react';

export default function ModalWrapper({ children }: { children: ReactNode }) {
  const { showModal, setShowModal } = useModal();
  if (!showModal) return;

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/[0.5] flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg relative shadow-md">
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
