import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken';
import {signOut} from 'next-auth/react';

const tokenExpiresIn = (token: string) => {
  const decoded = jwt.decode(token, {json: true})
  if (!decoded) throw new Error('TOKEN_DECODE_ERROR');
  return decoded.exp! -  Date.now() / 1000;
}

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  jwt: {},
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    jwt: (params) => {
      if (params.account && params.account.type !== 'credentials') {
        // this is used for external auth providers (e.g. Google).
        // we need to create a token HERE (as auth is done HERE) to pass to Nest server then.
        // Nest will just decode it when passed via `Authorization` header

        const payload = {sub: params.token.sub, username: params.token.name};
        params.token.accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {algorithm: 'HS512', expiresIn: 300});
        params.token.refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {algorithm: 'HS512', expiresIn: 60*60*24});
      }

      console.debug('jwt');

      if (params.user && !params.token.accessToken && !params.token.refreshToken) {
        console.debug('setting refresh token!!!');

        params.token.role = params.user.role;
        params.token.accessToken = params.user.accessToken
        params.token.refreshToken = params.user.refreshToken
      }

      return params.token
    },
    session: async (params) => {
      params.session.user.role = params.token.role;
      params.session.accessToken = params.token.accessToken;
      params.session.refreshToken = params.token.refreshToken;

      const refreshETA = tokenExpiresIn(params.session.refreshToken)
      const accessETA = tokenExpiresIn(params.session.accessToken)
      console.debug('jwt refresh remaining time', refreshETA, Date.now());
      console.debug('jwt access remaining time', accessETA, Date.now());

      // less than 30 sec, refresh token is expired, force sign out
      // navigation to sign in endpoint is handled in front part
      if (refreshETA < 60) {
        signOut();
        throw new Error('JWT_REFRESH_EXPIRED');
      }

      // less than 30 sec, try to refresh
      if (accessETA < 30) {
        const r = await fetch('http://localhost:3001/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({refreshToken: params.session.refreshToken})
        })

        if (!r.ok) {
          console.debug('error during refresh', r.statusText);
          throw new Error('JWT_REFRESH_ERROR');
        }

        const accessToken = (await r.json()).accessToken;
        console.debug('new access token received', accessToken);
        params.session.accessToken = accessToken;
        params.token.accessToken = accessToken;
      }

      params.session.refreshExpiresIn = refreshETA
      params.session.accessExpiresIn = tokenExpiresIn(params.session.accessToken)

      return params.session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const r = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: credentials?.username, password: credentials?.password})
          })

          const rJson = await r.json() as {
            user: {sub: number, username: string},
            accessToken: string
            refreshToken: string;
          };

          return {id: rJson.user.sub.toString(), name: rJson.user.username, email: '', role: 'dd', accessToken: rJson.accessToken, refreshToken: rJson.refreshToken}
        } catch (e) {
          return Promise.resolve(null);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ]
})

export { handler as GET, handler as POST }
