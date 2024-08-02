import { auth } from '@/auth';
import Link from 'next/link';
import prisma from '../../../../lib/prisma';
import EditForm from '@/app/components/EditForm';

export default async function Profile() {
  const info = await auth();
  const { name, email } = info?.user!;

  const user = await prisma.user.findUnique({
    where: {
      email: email || '',
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-xl lg:flex flex-col">
        <div className="flex justify-between w-full">
          <p className="">Welcome {name}!</p>
          <Link href={'/'}>Go home</Link>
        </div>
        <div className="w-full mt-3">
          <EditForm user={user!} />
        </div>
      </div>
    </main>
  );
}
