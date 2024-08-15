import { auth } from '@/auth';
import prisma from '../../../lib/prisma';
import DreamAnalyser from '../components/DreamAnalyser';

export default async function Page() {
  const info = await auth();
  const email = info?.user?.email || '';

  const rateLimitInfo = await prisma.rateLimit.findUnique({
    where: {
      email: email,
    },
  });

  return <DreamAnalyser rateLimitInfo={rateLimitInfo} />;
}
