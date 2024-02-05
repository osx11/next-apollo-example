'use client';

import {ApolloProvider} from '@apollo/client';
import apolloClient from '@/apollo-client';
import {BooksList} from '@/app/books/components/BooksList';
import {loadDevMessages, loadErrorMessages} from '@apollo/client/dev';
import {SessionProvider} from 'next-auth/react';

loadDevMessages();
loadErrorMessages();

export default function Books() {
  return (
    <SessionProvider>
      <ApolloProvider client={apolloClient}>
        <BooksList/>
      </ApolloProvider>
    </SessionProvider>
  )
}
