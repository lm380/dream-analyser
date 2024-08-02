'use client';
import React, { FormEvent, useState } from 'react';
import { State, updateLifeContext } from '../../../lib/actions';
import { useFormState } from 'react-dom';
import { useModal } from '@/contexts/ModalContext';

export const AddContext = ({
  email,
  currentContext,
}: {
  email: string;
  currentContext: string;
}) => {
  const [newContext, setNewContext] = useState(currentContext);
  const updateLifeContextWithEmail = updateLifeContext.bind(null, email);
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState<State | undefined, FormData>(
    updateLifeContextWithEmail,
    initialState
  );

  const { showModal, setShowModal } = useModal();

  const showFormHanlder = () => {
    setShowModal(!showModal);
  };

  const submitHandler = (e: FormEvent) => {
    showFormHanlder();
    setNewContext(
      ((e?.target as HTMLFormElement)[0] as HTMLTextAreaElement).value
    );
  };

  return (
    <>
      <form action={dispatch} onSubmit={submitHandler} className="space-y-3">
        <div className="rounded-md bg-gray-50 p-4 md:p-6 text-black">
          <div className="mb-4">
            <label
              htmlFor="context"
              className="mb-2 block text-sm font-medium text-gray-400"
            >
              Add details about your life&apos;s current circumstances to give a
              more meaningful analysis
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="context"
                  name="context"
                  defaultValue={newContext}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => showFormHanlder()}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            className="flex h-10 items-center rounded-lg bg-yellow-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            type="submit"
          >
            Update context
          </button>
        </div>
      </form>
    </>
  );
};
