import { Transform } from 'class-transformer';
import { Comment } from '@prisma/client';

export class CommentEntity implements Comment {
  id: string;
  content: string;

  authorId: string | null;
  articleId: string;

  @Transform(({ value }) => value?.getTime())
  createdAt: Date;

  constructor(partial: Partial<CommentEntity>) {
    Object.assign(this, partial);
  }
}
