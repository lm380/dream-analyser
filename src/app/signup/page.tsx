import Form from '@/app/components/create-form';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create',
};

export default async function Page() {
  return (
    <main>
      <Link href={'/'}>Go home</Link>
      <Form />
    </main>
  );
}
