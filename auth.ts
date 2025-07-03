import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { signin } from './action/auth-service';
import { AdapterUser } from 'next-auth/adapters';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      memberUuid: string;
      accessToken: string;
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        let user = null;

        if (credentials.email && credentials.password) {
          const res = await signin(
            credentials.email as string,
            credentials.password as string
          );

          if (res.isSuccess) {
            user = res.result;
          }
        }

        if (!user) {
          throw new Error('로그인에 실패했습니다.');
        }
        // return user object with their profile data
        return {
          ...user,
          memberUuid: user.memberUuid,
          accessToken: user.accessToken,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user as AdapterUser & {
        memberUuid: string;
        accessToken: string;
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
});
