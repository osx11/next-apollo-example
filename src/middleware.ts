// export default withAuth(
//   {
//     callbacks: {
//       authorized: ({ req, token }) => {
//         if (req.nextUrl.pathname === '/admin') {
//           return token?.role === "admin"
//         }
//
//         if (req.nextUrl.pathname === '/dashboard') {
//           // console.debug('TOKEN DB', token);
//           return token !== null;
//         }
//
//         return true;
//       },
//     },
//   }
// )

export default () => {}
