import { ArticleStatus } from '../article.types';

export class ArticleEntity {
  id: string;
  title: string;
  content: string;
  status: ArticleStatus;
  tags: string[];

  categoryId: string | null;
  authorId: string | null;

  createdAt: number;
  updatedAt: number;
}
