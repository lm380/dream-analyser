import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function SideNav() {
  const info = await auth();
  const user = info?.user;
  return (
    <nav className="bg-indigo-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-serif text-purple-300 cursor-pointer">
            DreamScape
          </span>
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link href="/analyser">
                <span className="text-white hover:text-purple-300 cursor-pointer">
                  Analysis
                </span>
              </Link>
              <Link href="/profile">
                <span className="text-white hover:text-purple-300 cursor-pointer">
                  Profile
                </span>
              </Link>
              <Link href="/profile/edit">
                <span className="text-white hover:text-purple-300 cursor-pointer">
                  Settings
                </span>
              </Link>
              <Link href="/journal">
                <span className="text-white hover:text-purple-300 cursor-pointer">
                  Journal
                </span>
              </Link>
              <span className="inline-block text-white hover:text-purple-300 cursor-pointer">
                <form
                  action={async () => {
                    'use server';
                    await signOut();
                  }}
                >
                  <button className="">Sign Out</button>
                </form>
              </span>
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
      </div>
    </nav>
  );
}
