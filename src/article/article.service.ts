import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ArticleEntity } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { randomUUID } from 'crypto';
import type { ArticleQueryDto } from './dto/article-query.dto';
import { BaseService } from 'src/common/base.service';
import {
  validateRelationOrThrow,
  removeRelatedItems,
} from 'src/common/collection.utils';

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(db: DatabaseService) {
    super(db, db.articles, 'Article');
  }

  override findAll(query: ArticleQueryDto = {}): ArticleEntity[] {
    const { status, categoryId, tag } = query;
    let articles = [...this.collection];
    if (status) {
      articles = articles.filter((a) => a.status === status);
    }
    if (categoryId) {
      articles = articles.filter((a) => a.categoryId === categoryId);
    }
    if (tag) {
      articles = articles.filter((a) => tag.every((t) => a.tags?.includes(t)));
    }
    return articles;
  }

  create(dto: CreateArticleDto): ArticleEntity {
    validateRelationOrThrow(this.db.users, dto.authorId, 'Author');
    validateRelationOrThrow(this.db.categories, dto.categoryId, 'Category');

    const article = new ArticleEntity();
    Object.assign(article, {
      ...dto,
      id: randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    this.collection.push(article);
    return article;
  }

  update(id: string, dto: UpdateArticleDto): ArticleEntity {
    const article = this.findOne(id);

    if (dto.categoryId !== undefined) {
      validateRelationOrThrow(this.db.categories, dto.categoryId, 'Category');
    }

    Object.assign(article, {
      ...dto,
      updatedAt: Date.now(),
    });

    return article;
  }

  remove(id: string): void {
    this.deleteFromCollection(id);
    removeRelatedItems(this.db.comments, 'articleId', id);
  }
}
