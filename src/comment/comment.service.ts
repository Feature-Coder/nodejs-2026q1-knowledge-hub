import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from 'src/common/base.service';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { randomUUID } from 'crypto';
import type { GetCommentDto } from './dto/get-comment.dto';
import {
  validateRelationOrThrow,
  applySortingAndPagination,
} from 'src/common/collection.utils';
import type { PaginatedResponse } from 'src/common/pagination.types';

@Injectable()
export class CommentService extends BaseService<CommentEntity> {
  constructor(db: DatabaseService) {
    super(db, db.comments, 'Comment');
  }

  findAllCommentsByArticleId(
    query: GetCommentDto,
  ): CommentEntity[] | PaginatedResponse<CommentEntity> {
    const filtered = this.collection.filter(
      (i) => i.articleId === query.articleId,
    );
    return applySortingAndPagination(filtered, query);
  }

  create(dto: CreateCommentDto): CommentEntity {
    validateRelationOrThrow(this.db.articles, dto.articleId, 'Article');
    const comment = new CommentEntity();
    Object.assign(comment, {
      ...dto,
      id: randomUUID(),
    });
    this.collection.push(comment);
    return comment;
  }

  remove(id: string): void {
    this.deleteFromCollection(id);
  }
}
