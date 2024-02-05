import {NextRequest} from 'next/server';
import {getToken} from 'next-auth/jwt';

const handler = async (req: NextRequest) => {
  console.debug(req.method);
  const token = await getToken({ req });

  return new Response(`Authorized: ${token?.name || 'unknown'}`, {status: 200})
}

export {handler as GET, handler as POST, handler as PATCH}
