import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    UserModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
