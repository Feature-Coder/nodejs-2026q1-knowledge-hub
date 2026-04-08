import { UnprocessableEntityException } from '@nestjs/common';
import { MESSAGES } from './messages';

export function validateRelationOrThrow<U extends { id: string }>(
  collection: U[],
  id: string | null | undefined,
  entityName: string,
): void {
  if (!id) return;

  const exists = collection.some((item) => item.id === id);
  if (!exists) {
    throw new UnprocessableEntityException(
      MESSAGES.RELATION_NOT_FOUND(entityName),
    );
  }
}

export function removeRelatedItems<U>(
  collection: U[],
  foreignKey: keyof U,
  id: string,
): void {
  for (let i = collection.length - 1; i >= 0; i--) {
    if ((collection[i][foreignKey] as any) === id) {
      collection.splice(i, 1);
    }
  }
}

import type { PaginationQueryDto } from './dto/pagination-query.dto';
import type { PaginatedResponse } from './pagination.types';

export function applySortingAndPagination<T>(
  data: T[],
  query: PaginationQueryDto,
): T[] | PaginatedResponse<T> {
  const result = [...data];

  // Apply sorting
  if (query.sortBy) {
    const orderCoef = query.order === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      const valA = a[query.sortBy as keyof T];
      const valB = b[query.sortBy as keyof T];

      if (valA < valB) return -1 * orderCoef;
      if (valA > valB) return 1 * orderCoef;
      return 0;
    });
  }

  // Apply pagination only if page and limit are provided
  if (query.page !== undefined && query.limit !== undefined) {
    const startIndex = (query.page - 1) * query.limit;
    const endIndex = startIndex + query.limit;

    return {
      total: result.length,
      page: query.page,
      limit: query.limit,
      data: result.slice(startIndex, endIndex),
    };
  }

  return result;
}
