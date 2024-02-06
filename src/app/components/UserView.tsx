'use client';

import styles from './user-view.module.css'
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';

export const UserView = () => {
  const router = useRouter();
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Fetching login information</p>
  }

  if (status === 'authenticated' && session?.user) {
    return (
      <div className={styles.container}>
        <p style={{color: 'green'}}>{session.user.name}</p>
        <button className={styles.btn}  onClick={() => router.push('/api/auth/signout')}>Log out</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <p style={{color: 'red'}}>NOT AUTHENTICATED!</p>
      <button className={styles.btn} onClick={() => router.push('/api/auth/signin')}>Log in</button>
    </div>
  )
}
