import type { NextAuthConfig } from 'next-auth';
import google from 'next-auth/providers/google';

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
      if (isOnAnalayser || isOnProfile) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
  providers: [google], // Add providers with an empty array for now
} satisfies NextAuthConfig;
