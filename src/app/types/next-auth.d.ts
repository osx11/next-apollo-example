import {DefaultSession} from 'next-auth'

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"],
    accessToken: string
    refreshToken: string
    refreshExpiresIn: number
    accessExpiresIn: number
  }

  interface User {
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string,
    accessToken: string;
    refreshToken: string;
  }
}
