import type { NextAuthConfig } from 'next-auth';
import google from 'next-auth/providers/google';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: { signIn: '/login' },

  callbacks: {
    async redirect({ url, baseUrl }) {
      return '/profile';
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAnalayser = nextUrl.pathname.startsWith('/analyser');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      const isOnSignup = nextUrl.pathname.startsWith('/signup');
      if (isOnAnalayser || isOnProfile) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      if (isOnSignup) {
        if (!isLoggedIn) return true;
        return NextResponse.redirect(new URL('/profile/edit', nextUrl.origin));
      }
      return true;
    },
  },
  providers: [google], // Add providers with an empty array for now
} satisfies NextAuthConfig;
