'use client';
import {ErrorBoundary, useErrorBoundary} from 'react-error-boundary';
import {useEffect} from 'react';

const ErrorComponent = ({error, resetErrorBoundary}: {error: string, resetErrorBoundary: () => void}) => {
  return <div style={{color: 'red'}} onClick={resetErrorBoundary}>{error}</div>
}

const ComponentThrowsError = () => {
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        console.debug('error thrown');
        throw new Error('Error shit')
      } catch(e) {
        showBoundary((e as Error).message);
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  return <div>Some data</div>
}

export const ErrorBoundaryExample = () => {

  return (
    <ErrorBoundary FallbackComponent={ErrorComponent}>
      <ComponentThrowsError/>
    </ErrorBoundary>
  )
}
