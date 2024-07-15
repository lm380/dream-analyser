import { auth } from '@/auth';
import Link from 'next/link';

export default async function Home() {
  const info = await auth();
  console.log(info);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-xl lg:flex">
        {!info && (
          <>
            <Link className="absolute right-[2%] top-[5%]" href={'/signup'}>
              Sign up
            </Link>
            <Link className="absolute right-[10%] top-[5%]" href={'/login'}>
              Login
            </Link>
          </>
        )}

        <div className="content w-full mt-[5%]">
          <h3>This is the landing page!</h3>
        </div>
      </div>
    </main>
  );
}
