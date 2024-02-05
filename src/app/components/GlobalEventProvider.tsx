'use client';

import {useEffect} from 'react';

export const GlobalEventProvider = () => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.debug(e.code);
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null;
}

