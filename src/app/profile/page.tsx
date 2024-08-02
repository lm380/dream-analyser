import prisma from '../../../lib/prisma';
import { auth } from '@/auth';
import { Profile } from '../components/Profile';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You need to be signed in to view this page.</p>
        <a href="/auth/signin">Sign In</a>
      </div>
    );
  }

  const email = session.user?.email;
  const user = await prisma.user.findUnique({
    where: {
      email: email || '',
    },
    select: {
      email: true,
      name: true,
      lifeContext: true,
      dreams: {
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  });

  return <Profile initialUser={user!} />;
}
