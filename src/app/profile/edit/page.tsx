import { auth } from '@/auth';
import Link from 'next/link';
import prisma from '../../../../lib/prisma';
import EditForm from '@/app/components/edit-form';

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
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-xl lg:flex">
        <h3>Edit</h3>
        <p>Welcome {name}!</p>
        <Link href={'/'}>Go home</Link>
        <EditForm user={user!} />
      </div>
    </main>
  );
}
