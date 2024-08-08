'use client';

import Link from 'next/link';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useFormState } from 'react-dom';
import { State, updateUser } from '../../../lib/actions';
import { User } from '@prisma/client';

export default function EditForm({ user }: { user: User }) {
  const initialState = { message: null, errors: {} };
  const updateUserWithEmail = updateUser.bind(null, user.email);
  const [state, dispatch] = useFormState<State, FormData>(
    updateUserWithEmail,
    initialState
  );

  return (
    <form action={dispatch} className="space-y-6">
      <div className="space-y-6">
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
              defaultValue={user.name}
              className="w-full px-4 py-2 pl-10 bg-indigo-800 border border-indigo-700 rounded-md shadow-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              aria-describedby="name-description"
            />
            <UserCircleIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
          </div>
          <p id="name-description" className="mt-1 text-sm text-indigo-300">
            Enter your full name
          </p>
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
              value={user.email}
              disabled
              className="w-full pl-10 px-4 py-2 bg-indigo-800 border border-indigo-700 rounded-md shadow-sm text-indigo-300"
              aria-describedby="email-description"
            />
            <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
          </div>
          <p id="email-description" className="mt-1 text-sm text-indigo-300">
            Your email address cannot be changed
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-indigo-100">
            Change Password
          </h3>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-indigo-200 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                autoComplete="new-password"
                min={8}
                type="password"
                className="w-full pl-10 px-4 py-2 bg-indigo-800 border border-indigo-700 rounded-md shadow-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-describedby="password-description"
              />
              <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
            </div>
            <p
              id="password-description"
              className="mt-1 text-sm text-indigo-300"
            >
              Must be at least 8 characters long
            </p>
          </div>
          <div>
            <label
              htmlFor="password-retype"
              className="block text-sm font-medium text-indigo-200 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="password-retype"
                autoComplete="new-password"
                min={8}
                name="password-retype"
                type="password"
                className="w-full pl-10 px-4 py-2 bg-indigo-800 border border-indigo-700 rounded-md shadow-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Error messages */}
      <div className="space-y-2">
        {Object.entries(state.errors || {}).map(([field, errors]) => (
          <div
            key={field}
            id={`${field}-error`}
            aria-live="polite"
            aria-atomic="true"
          >
            {errors.map((error: string) => (
              <p className="text-sm text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Link
          href="/"
          className="px-4 py-2 border border-indigo-600 rounded-md text-sm font-medium text-indigo-200 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Account
        </button>
      </div>
    </form>
  );
}
