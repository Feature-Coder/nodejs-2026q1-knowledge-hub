import { Exclude } from 'class-transformer';
import { UserRole } from '../user.types';

export class UserEntity {
  id: string;
  login: string;

  @Exclude()
  password: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}
