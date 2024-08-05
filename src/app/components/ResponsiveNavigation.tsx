'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from './NavLinks';
import { User } from '@auth/core/types';

const ResponsiveNavigation = ({
  user,
  signOutAction,
}: {
  user: User;
  signOutAction: () => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-indigo-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-serif text-purple-300 cursor-pointer">
            DreamScape
          </span>
        </Link>
        {isMobile ? (
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        ) : (
          <div className="space-x-4">
            {user ? (
              <>
                <NavLinks isMobile={isMobile} />
                <form action={signOutAction} className="inline-block">
                  <button className="text-white hover:text-purple-300 cursor-pointer">
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-white hover:text-purple-300 cursor-pointer">
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="text-white hover:text-purple-300 cursor-pointer">
                    Sign up
                  </span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      {isMobile && isOpen && (
        <div className="mt-4">
          {user ? (
            <>
              <NavLinks isMobile={isMobile} />
              <form action={signOutAction}>
                <button className="block w-full text-left text-white hover:text-purple-300 cursor-pointer py-2">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="block text-white hover:text-purple-300 cursor-pointer py-2">
                  Login
                </span>
              </Link>
              <Link href="/signup">
                <span className="block text-white hover:text-purple-300 cursor-pointer py-2">
                  Sign up
                </span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default ResponsiveNavigation;
