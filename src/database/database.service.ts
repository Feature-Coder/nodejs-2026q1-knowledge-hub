import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';
import { Category } from 'src/category/entities/category.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class DatabaseService {
  public users: User[] = [];
  public articles: Article[] = [];
  public categories: Category[] = [];
  public comments: Comment[] = [];
}
