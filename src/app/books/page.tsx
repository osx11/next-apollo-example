'use client';

import {ApolloProvider} from '@apollo/client';
import apolloClient from '@/apollo-client';
import {BooksList} from '@/app/books/components/BooksList';
import {loadDevMessages, loadErrorMessages} from '@apollo/client/dev';
import {ProtectedView} from '@/app/components/ProtectedView';

loadDevMessages();
loadErrorMessages();

export default function Books() {
  return (
    <ProtectedView>
      <ApolloProvider client={apolloClient}>
        <BooksList/>
      </ApolloProvider>
    </ProtectedView>
  )
}
