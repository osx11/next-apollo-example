import {ReviewEntity} from '@/app/data/entities/review.entity';

export class BookEntity {
  id!: number;
  title!: string;
  author!: string;
  reviews!: ReviewEntity[];
}
