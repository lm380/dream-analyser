import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/login' },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      console.log(url, baseUrl);

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
      // console.log(nextUrl);
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
