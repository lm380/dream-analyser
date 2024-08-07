'use client';

import Link from 'next/link';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useFormState } from 'react-dom';
import { createUser, State } from '../../../lib/actions';

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState<State, FormData>(
    createUser,
    initialState
  );
  return (
    <form action={dispatch} className="space-y-3">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-indigo-200 mb-1"
        >
          Name
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            placeholder={'Enter your name'}
            className="w-full px-4 py-2 pl-10 bg-indigo-800 border border-indigo-700 rounded-md shadow-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-describedby="name-description"
          />
          <UserCircleIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
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

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-indigo-200 mb-1"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            placeholder="Enter your email address"
            className="w-full pl-10 px-4 py-2 bg-indigo-800 border border-indigo-700 rounded-md shadow-sm text-indigo-300"
            aria-describedby="email-error"
          />
          <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
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

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-indigo-200 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            placeholder="Enter your password"
            minLength={6}
            type="password"
            className="w-full pl-10 px-4 py-2 bg-indigo-800 border border-indigo-700 rounded-md shadow-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-describedby="password-error"
          />
          <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
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
        <button type="submit">Create account</button>
      </div>
    </form>
  );
}
