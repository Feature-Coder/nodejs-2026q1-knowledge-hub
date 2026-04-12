import { Transform } from 'class-transformer';
import { Article, ArticleStatus } from '@prisma/client';

export class ArticleEntity implements Article {
  id: string;
  title: string;
  content: string;
  status: ArticleStatus;

  categoryId: string | null;
  authorId: string | null;

  tags: string[];

  @Transform(({ value }) => value?.getTime())
  createdAt: Date;

  @Transform(({ value }) => value?.getTime())
  updatedAt: Date;

  constructor(partial: Partial<ArticleEntity>) {
    Object.assign(this, partial);
  }
}
