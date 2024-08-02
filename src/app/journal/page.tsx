import { auth } from '@/auth';
import prisma from '../../../lib/prisma';
import { Journal } from '../components/Journal';

export default async function JournalPage() {
  const info = await auth();
  const email = info?.user?.email!;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      dreams: true,
    },
  });

  const dreams = user?.dreams;

  return <Journal initialUser={user!} />;
}
