import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { ArticleEntity } from 'src/article/entities/article.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';

@Injectable()
export class DatabaseService {
  public users: UserEntity[] = [];
  public articles: ArticleEntity[] = [];
  public categories: CategoryEntity[] = [];
  public comments: CommentEntity[] = [];
}
