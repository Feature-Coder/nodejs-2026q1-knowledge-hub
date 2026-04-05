import { Injectable } from '@nestjs/common';
import type { ArticleEntity } from 'src/article/entities/article.entity';
import type { CategoryEntity } from 'src/category/entities/category.entity';
import type { CommentEntity } from 'src/comment/entities/comment.entity';
import type { UserEntity } from 'src/user/entities/user.entity';
@Injectable()
export class DatabaseService {
  public users: UserEntity[] = [];
  public articles: ArticleEntity[] = [];
  public categories: CategoryEntity[] = [];
  public comments: CommentEntity[] = [];
}
