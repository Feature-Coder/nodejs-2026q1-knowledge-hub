import { NotFoundException } from '@nestjs/common';
import { MESSAGES } from 'src/common/messages';
import { DatabaseService } from 'src/database/database.service';
import type { PaginationQueryDto } from './dto/pagination-query.dto';
import type { PaginatedResponse } from './pagination.types';
import { applySortingAndPagination } from './collection.utils';

export abstract class BaseService<T extends { id: string }> {
  constructor(
    protected readonly db: DatabaseService,
    protected readonly collection: T[],
    protected readonly entityName: string,
  ) {}

  protected deleteFromCollection(id: string): T {
    const index = this.collection.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new NotFoundException(MESSAGES.NOT_FOUND(this.entityName));
    }
    return this.collection.splice(index, 1)[0];
  }

  findAll(query?: PaginationQueryDto): T[] | PaginatedResponse<T> {
    if (query && Object.keys(query).length > 0) {
      return applySortingAndPagination(this.collection, query);
    }
    return this.collection;
  }

  findOne(id: string): T {
    const item = this.collection.find((i) => i.id === id);
    if (!item) {
      throw new NotFoundException(MESSAGES.NOT_FOUND(this.entityName));
    }
    return item;
  }
}
