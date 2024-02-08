'use client'

import apolloClient from '@/apollo-client';
import {ProtectedView} from '@/app/components/ProtectedView';
import {ApolloProvider} from '@apollo/client';
import {ReactNode} from 'react';

export const ClientWrapper = ({children}: {children: ReactNode}) => {
  return (
    <ProtectedView>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </ProtectedView>
  )
}
