import { Exclude, Transform } from 'class-transformer';
import { User, UserRole } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  login: string;

  @Exclude()
  password: string;

  role: UserRole;

  @Transform(({ value }) => value.getTime())
  createdAt: Date;

  @Transform(({ value }) => value.getTime())
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
