import {BooksList} from '@/app/books/components/BooksList';
import {loadDevMessages, loadErrorMessages} from '@apollo/client/dev';
import {ClientWrapper} from '@/app/components/ClientWrapper';
import {Metadata} from 'next';

loadDevMessages();
loadErrorMessages();

export const metadata: Metadata = {
  title: 'Books library'
}

export default function Books() {
  return (
    <ClientWrapper>
      <BooksList/>
    </ClientWrapper>
  )
}
