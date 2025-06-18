import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { signin } from "./action/auth-service";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
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
          throw new Error("로그인에 실패했습니다.");
        }
        // return user object with their profile data
        return { ...user, id: credentials.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
});
