export class CommentEntity {
  id: string;
  content: string;
  createdAt: number;
  authorId: string | null;
  articleId: string;
}
