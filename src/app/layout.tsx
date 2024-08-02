import './globals.css';

import SideNav from './components/SideNav';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-900 to-black text-white">
          <SideNav />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-indigo-900 py-4 text-center">
            <p>© 2024 DreamScape. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
