'use client'

import 'dotenv/config'
import Image from 'next/image';
import styles from './page.module.css';
import {GlobalEventProvider} from '@/app/components/GlobalEventProvider';
import Link from 'next/link';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <GlobalEventProvider/>
        {/*<Session data={'test data'}/>*/}
        {/*<ErrorBoundaryExample/>*/}

        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Link
          href="/books"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2>
            Books <span>-&gt;</span>
          </h2>
          <p>Books library</p>
        </Link>
      </div>
    </main>
  );
}
