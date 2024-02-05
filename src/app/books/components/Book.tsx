import styled from 'styled-components';
import {BookEntity} from '@/app/data/entities/book.entity';
import {gql} from '@apollo/client';

type BookProps = {
  book: BookEntity;
  onReviewAdd: (mark: number) => void;
}

const query = gql `
  query Book($id: Int!) {
    book(id: $id) {
      title
      author
      reviews {
        mark
      }
    }
  }  
`;

export const Book = ({book, onReviewAdd}: BookProps) => {
  return (
    <BookCard>
      <BookTitle>{book.title}</BookTitle>
      <p>Author: {book.author}</p>
      {book.reviews.length > 0 ?
        <p>Mark: {(book.reviews.reduce((a, b) => a + b.mark, 0) / book.reviews.length).toFixed(2)}</p>
        :
        <p>Mark: ?</p>
      }
      <ReviewButtons>
        {[...Array(5)].map((_, i) => <button key={i} onClick={() => onReviewAdd(i+1)}>{i + 1}</button>)}
      </ReviewButtons>
    </BookCard>
  )
}

const ReviewButtons = styled.div `
  display: flex;
  gap: 3px;
  
  button {
    padding: 5px;
  }
`;


const BookCard = styled.div `
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: center;
  border: 1px #fff solid;
  border-radius: 10px;
  padding: 10px;
  min-width: 100px;
  min-height: 200px;
`;

const BookTitle = styled.p `
  border-bottom: 1px #fff solid;
  font-weight: 600;
  font-size: 1.2rem;
`;

