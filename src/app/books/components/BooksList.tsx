'use client';

import styled from 'styled-components';
import {gql, useMutation, useQuery} from '@apollo/client';
import {BookEntity} from '@/app/data/entities/book.entity';
import {Book} from '@/app/books/components/Book';
import {useEffect} from 'react';
import {ReviewEntity} from '@/app/data/entities/review.entity';
import {signOut, useSession} from 'next-auth/react';
import Link from 'next/link';

const BOOKS_QUERY = gql `
  query {
    books {
      id
      title
      author
      reviews {
        mark
      }
    }
  }
`;

const REVIEW_ADDED_SUBSCRIPTION = gql `
  subscription OnReviewAdded {
    reviewAdded {
      mark
      book {
        id
      }
    }
  }
`;

const ADD_REVIEW_MUTATION = gql `
  mutation CreateReview($entity: CreateReviewDto!) {
    createReview(entity: $entity) {
      id
    }
  }
`;

export const BooksList = () => {
  const session = useSession();
  const {data, subscribeToMore} = useQuery<{books: BookEntity[]}>(BOOKS_QUERY);
  const [apolloCreateReview] = useMutation(ADD_REVIEW_MUTATION)

  useEffect(() => {
    const unsubscribe = subscribeToMore<{reviewAdded: ReviewEntity}>({
      document: REVIEW_ADDED_SUBSCRIPTION,
      updateQuery: (prev, {subscriptionData} ) => {
        const bookId = subscriptionData.data.reviewAdded.book.id

        return {
          ...prev,
          books: prev.books.map((book) =>
            book.id === bookId
              ? { ...book, reviews: [...book.reviews, subscriptionData.data.reviewAdded] }
              : book
          ),
        };
      }
    })

    return () => unsubscribe()
  }, [])

  async function createReview(bookId: number, mark: number) {
    await apolloCreateReview({
      variables: {
        entity: {
          book: bookId,
          comment: 'Comment??',
          mark: mark
        }
      }
    })
  }

  return (
    <Layout>
      {session.status === 'authenticated' &&
        <div style={{display: 'flex', gap: 10}}>
          <p style={{color: 'green'}}>Authenticated! ({session.data.user.name})</p>
          <button onClick={() => signOut()}>Log out</button>
          <button>
            <Link href={'/'}>Go to main</Link>
          </button>
        </div>
      }

      <BooksLayout>
        {data?.books.map((book) => (
          <Book key={book.id} book={book} onReviewAdd={(mark) => createReview(book.id, mark)}/>
        ))}
      </BooksLayout>
    </Layout>
  )
}

const Layout = styled.div `
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

const BooksLayout = styled.div `
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

