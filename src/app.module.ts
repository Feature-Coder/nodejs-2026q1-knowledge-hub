import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    UserModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
