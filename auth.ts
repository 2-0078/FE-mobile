import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { signin } from './action/auth-service/index';
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
        if (!credentials.email || !credentials.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.');
        }

        try {
          const res = await signin(
            credentials.email as string,
            credentials.password as string
          );

          if (res.isSuccess && res.result) {
            return {
              ...res.result,
              memberUuid: res.result.memberUuid,
              accessToken: res.result.accessToken,
            };
          } else {
            throw new Error(res.message || '로그인에 실패했습니다.');
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('로그인 중 오류가 발생했습니다.');
        }
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
    redirect({ url, baseUrl }) {
      // callbackUrl이 있으면 해당 URL로, 없으면 홈으로
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
});
