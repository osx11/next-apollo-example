'use client';

import {SessionProvider} from 'next-auth/react'
import {UserView} from '@/app/components/UserView';

export const Session = ({data}: {data: string}) => {
  return (
    <SessionProvider>
      <p>{data}</p>
      <UserView/>
    </SessionProvider>
  )
}
