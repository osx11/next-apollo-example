import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  jwt: {},
  callbacks: {
    jwt: (params) => {
      if (params.account) {
        // this is used for external auth providers (e.g. Google).
        // we need to create a token HERE (as auth is done HERE) to pass to Nest server then.
        // Nest will just decode it when passed via `Authorization` header
        const payload = {sub: params.token.sub, username: params.token.name};
        params.token.accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {algorithm: 'HS512', expiresIn: 300});
      }

      if (params.user && !params.token.accessToken) {
        params.token.role = params.user.role;
        params.token.accessToken = params.user.accessToken
      }

      return params.token
    },
    session: (params) => {
      params.session.user.role = params.token.role;
      params.session.accessToken = params.token.accessToken;
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
          };

          console.debug('TOKEN', rJson.accessToken);

          return {id: rJson.user.sub.toString(), name: rJson.user.username, email: '', role: '', accessToken: rJson.accessToken}
        } catch (e) {
          return Promise.resolve(null);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT!,
      clientSecret: process.env.GOOGLE_SECRET!,
    })
  ]
})

export { handler as GET, handler as POST }
