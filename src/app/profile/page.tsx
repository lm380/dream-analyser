import { auth } from '@/auth';
import Link from 'next/link';
import prisma from '../../../lib/prisma';

export default async function Profile() {
  const info = await auth();
  const name = info?.user?.name;
  const email = info?.user?.email;

  const user = await prisma.user.findUnique({
    where: {
      email: email || '',
    },
  });

  const dreams = await prisma.dream.findMany({
    where: {
      userId: user?.id,
    },
  });

  const addContext = () => {};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-xl lg:flex flex-col">
        <div className="flex flex-row w-full">
          <p className="text-3xl">Welcome {name}!</p>
          <Link className="absolute right-[2%] top-[5%]" href={'/profile/edit'}>
            Edit Account
          </Link>
        </div>
        <div className="content w-full mt-[5%]">
          <h3>This is a profile page</h3>
        </div>
      </div>
    </main>
  );
}
