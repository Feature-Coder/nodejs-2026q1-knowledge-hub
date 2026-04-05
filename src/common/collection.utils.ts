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
