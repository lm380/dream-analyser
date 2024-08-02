import Link from 'next/link';
import NavLinks from '@/app/components/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { auth, signOut } from '@/auth';

export default async function SideNav() {
  const info = await auth();
  const user = info?.user;
  return (
    //   <div className="flex h-full flex-col px-3 py-4 md:px-2">
    //     <Link
    //       className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
    //       href="/"
    //     >
    //       <div className="w-32 text-white md:w-40"></div>
    //     </Link>
    //     <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
    //       <NavLinks />
    //       <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
    //       <form
    //         action={async () => {
    //           'use server';
    //           await signOut();
    //         }}
    //       >
    //         <button className="flex h-[48px] text-black w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
    //           <PowerIcon className="w-6" />
    //           <div className="hidden md:block">Sign Out</div>
    //         </button>
    //       </form>
    //     </div>
    //   </div>
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
