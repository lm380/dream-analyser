import { auth } from '@/auth';
import Link from 'next/link';

import Head from 'next/head';

export default async function Home() {
  const info = await auth();
  const user = info?.user;
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      <Head>
        <title>DreamScape - AI Dream Analysis</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-serif mb-4">
          Welcome to <span className="text-purple-300">DreamScape</span>
        </h1>

        <p className="text-xl mb-8">
          Unlock the secrets of your subconscious with AI-powered dream analysis
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {user ? (
            <a
              href="/analyser"
              className="bg-purple-300 text-indigo-900 p-6 rounded-lg hover:bg-white transition duration-300"
            >
              <h3 className="text-2xl mb-2">Get Started &rarr;</h3>
              <p>Start analysing your dreams</p>
            </a>
          ) : (
            <a
              href="/signup"
              className="bg-purple-300 text-indigo-900 p-6 rounded-lg hover:bg-white transition duration-300"
            >
              <h3 className="text-2xl mb-2">Get Started &rarr;</h3>
              <p>Create your account and begin your journey.</p>
            </a>
          )}

          <a
            href="/about"
            className="bg-purple-300 text-indigo-900 p-6 rounded-lg hover:bg-white transition duration-300"
          >
            <h3 className="text-2xl mb-2">Learn More &rarr;</h3>
            <p>Discover how DreamScape can enhance your self-understanding.</p>
          </a>
        </div>
      </main>
    </div>
  );
}

// export default async function Home() {
//   const info = await auth();
//   console.log(info);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-xl lg:flex">
//         {!info && (
//           <>
//             <Link className="absolute right-[2%] top-[5%]" href={'/signup'}>
//               Sign up
//             </Link>
//             <Link className="absolute right-[10%] top-[5%]" href={'/login'}>
//               Login
//             </Link>
//           </>
//         )}

//         <div className="content w-full mt-[5%]">
//           <h3>This is the landing page!</h3>
//         </div>
//       </div>
//     </main>
//   );
// }
