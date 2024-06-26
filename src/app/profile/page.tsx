import { auth } from '@/auth';
import Link from 'next/link';
import prisma from '../../../lib/prisma';

export default async function Profile() {
  const info = await auth();
  const { name, email } = info?.user!;

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

  console.log(dreams);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-xl lg:flex">
        <h3>This is a profile page</h3>
        <p>Welcome {name}!</p>
      </div>
    </main>
  );
}
