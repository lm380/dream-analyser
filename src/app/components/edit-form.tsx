'use client';

import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useFormState } from 'react-dom';
import { createUser, State, updateUser } from '../../../lib/actions';
import { User } from '@prisma/client';

export default function EditForm({ user }: { user: User }) {
  const initialState = { message: null, errors: {} };
  const updateUserWithEmail = updateUser.bind(null, user.email);
  const [state, dispatch] = useFormState<State, FormData>(
    updateUserWithEmail,
    initialState
  );
  return (
    <form action={dispatch} className="space-y-3">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Enter your name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={user.name}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div id="name-error" aria-live="polite" aria-atomic="true">
        {state.errors?.name &&
          state.errors.name.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      {/* User Email */}
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Enter your email address
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="email"
              name="email"
              value={user.email}
              disabled
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>
      <div id="email-error" aria-live="polite" aria-atomic="true">
        {state.errors?.email &&
          state.errors.email.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      {/* User Password */}
      <div className="mb-4">
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Enter your Password
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="password"
              name="password"
              placeholder="Enter your new password"
              type="password"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="password-error"
            />
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div className="relative">
            <input
              id="password-retype"
              name="password-retype"
              placeholder="Please retype your new password"
              type="password"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="password-error"
            />
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>
      <div id="password-error" aria-live="polite" aria-atomic="true">
        {state.errors?.password &&
          state.errors.password.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button
          className="flex h-10 items-center rounded-lg bg-yellow-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          type="submit"
        >
          Update account
        </button>
      </div>
    </form>
  );
}
