import { auth } from '@/auth';
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
    <div className="min-h-screen bg-indigo-950 text-white">
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-semibold mb-8">Edit Account</h1>
        <div className="bg-indigo-900 rounded-lg shadow-lg p-6">
          <p className="text-xl mb-6">Welcome, {name}!</p>
          <EditForm user={user!} />
        </div>
      </main>
    </div>
  );
}
