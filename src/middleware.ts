import {withAuth} from 'next-auth/middleware';

export default withAuth(
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname === '/admin') {
          return token?.role === "admin"
        }

        if (req.nextUrl.pathname === '/dashboard') {
          return token !== null;
        }

        return true;
      },
    },
  }
)
