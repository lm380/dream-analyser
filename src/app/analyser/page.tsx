import { auth } from '@/auth';
import prisma from '../../../lib/prisma';
import DreamAnalyser from '../components/DreamAnalyser';

export default async function Page() {
  const info = await auth();
  const email = info?.user?.email;
  const user = await prisma.user.findUnique({
    where: {
      email: email || '',
    },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <DreamAnalyser user={user} />
      </div>
    </main>
  );
}
