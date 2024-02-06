'use client';

import {ReactNode, useEffect, useState} from 'react';
import {SessionProvider, useSession} from 'next-auth/react';
import {redirect} from 'next/navigation';

const ProtectedViewPure = ({children}: {children: ReactNode}) => {
  const {data, status, update} = useSession();
  const [isOk, setIsOk] = useState(false)

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !data) {
      redirect('/api/auth/signin')
      return;
    }

    console.debug('EXPIRES IN', data.accessExpiresIn);

    if (data.accessExpiresIn < 10) {
      update();
      return;
    }

    const timeout = setTimeout(async() => {
      const r = await fetch('http://localhost:3001/auth/refresh', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refreshToken: data?.refreshToken})
      })

      if (!r.ok) {
        clearTimeout(timeout)
        redirect('/api/auth/signin')
      }

      const json = await r.json();
      const newAccessToken = await json.accessToken;

      console.debug('ACCESS TOKEN UPDATED TO', newAccessToken);

      await update({...data, accessToken: newAccessToken})
    }, (data.accessExpiresIn - 10) * 1000)

    setIsOk(!!data?.user)

    return () => clearTimeout(timeout)
  }, [data, status])

  if (isOk) {
    return <>{children}</>
  }

  return null;
}

export const ProtectedView = ({children}: {children: ReactNode}) => {
  return (
      <SessionProvider>
        <ProtectedViewPure>
          {children}
        </ProtectedViewPure>
      </SessionProvider>
    )
}
