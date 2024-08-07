import Form from '@/app/components/CreateForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create',
};

export default async function Page() {
  return (
    <main>
      <Form />
    </main>
  );
}
