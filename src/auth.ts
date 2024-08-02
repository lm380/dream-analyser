import Credentials from 'next-auth/providers/credentials';
import { ZodError } from 'zod';
import type { User } from '@prisma/client';
import * as argon2 from 'argon2';
import Google from 'next-auth/providers/google';
import prisma from '../lib/prisma';
import { signInSchema } from '../lib/zod';
import NextAuth, {
  User as NextAuthUser,
  Account,
  Profile,
  Session,
} from 'next-auth';
import { JWT } from 'next-auth/jwt';

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user.');
  }
}

export const authOptions = {
  pages: {
    signIn: '/login',
  },

  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          let user: User | null = null;
          const result = await signInSchema.safeParseAsync(credentials);
          if (!result.success) {
            throw new ZodError(result.error.errors);
          }
          const { email, password } = result.data;

          user = await getUser(email);
          if (!user) throw new Error('User not found.');
          const argonMatch = await argon2.verify(user.password, password);
          if (argonMatch) return user;
          return null;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          console.error(error);
          return null;
        }
      },
    }),
    Google,
  ],
  callbacks: {
    async redirect({}) {
      return '/profile';
    },
    async signIn(params: {
      user: NextAuthUser;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }) {
      if (params.account?.provider === 'google') {
        const email = params.user.email ?? '';
        const name = params.user.name ?? 'Unknown user';
        const defaultPassword = await argon2.hash('123456');

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
          // Create a new user if not exists
          await prisma.user.create({
            data: {
              email,
              name,
              password: defaultPassword,
            },
          });
        }
      }
      return true; // If true, user is authenticated
    },
    async session(params: { session: Session; user: NextAuthUser }) {
      const { session, user } = params;
      if (user) {
        session.user = {
          id: user.id ?? '',
          email: user.email ?? '',
          name: user.name ?? '',
        };
      }

      return session;
    },
    async jwt(params: { token: JWT; user?: NextAuthUser }) {
      const { token, user } = params;
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions);
