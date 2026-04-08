import { Exclude } from 'class-transformer';
import { UserRole } from '../user.types';

export class UserEntity {
  id: string;
  login: string;

  @Exclude()
  password: string;

  role: UserRole = UserRole.VIEWER;
  createdAt: number;
  updatedAt: number;

  constructor() {
    const timestamp = Date.now();
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }
}
