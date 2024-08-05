import { auth, signOut } from '@/auth';
import ResponsiveNavigation from './ResponsiveNavigation';

export default async function SideNav() {
  const info = await auth();
  const user = info?.user;

  const signOutAction = async () => {
    'use server';
    await signOut();
  };

  return <ResponsiveNavigation user={user!} signOutAction={signOutAction} />;
}
