import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-xl lg:flex">
        <h3>This is the landing page!</h3>
        <Link href={'/signup'}>Sign up</Link>
        <Link href={'/login'}>Login</Link>
      </div>
    </main>
  );
}
