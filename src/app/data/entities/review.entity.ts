import {BookEntity} from '@/app/data/entities/book.entity';

export class ReviewEntity {
  id!: number;
  comment!: string;
  mark!: number;
  book!: BookEntity;
}
