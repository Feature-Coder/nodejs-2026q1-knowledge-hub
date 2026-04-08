export const MESSAGES = {
  INVALID_UUID: (entity: string) =>
    `Bad request. ${entity} is invalid (not uuid)`,
  NOT_FOUND: (entity: string) => `${entity} was not found`,
  MISSING_FIELDS: 'Bad request. body does not contain required fields',
  OLD_PASSWORD_WRONG: 'oldPassword is wrong',
  RELATION_NOT_FOUND: (entity: string) =>
    `${entity} with given id doesn't exist`,
} as const;
