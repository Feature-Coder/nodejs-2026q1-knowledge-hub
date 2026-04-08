import { ForbiddenException, Injectable } from '@nestjs/common';
import { MESSAGES } from 'src/common/messages';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from 'src/common/base.service';
import { removeRelatedItems } from 'src/common/collection.utils';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(db: DatabaseService) {
    super(db, db.users, 'User');
  }

  create(dto: CreateUserDto): UserEntity {
    const user: UserEntity = new UserEntity();
    Object.assign(user, {
      ...dto,
      id: randomUUID(),
    });
    this.collection.push(user);
    return user;
  }

  updatePassword(id: string, dto: UpdatePasswordDto): UserEntity {
    const user = this.findOne(id);

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException(MESSAGES.OLD_PASSWORD_WRONG);
    }

    Object.assign(user, {
      password: dto.newPassword,
      updatedAt: Date.now(),
    });

    return user;
  }

  remove(id: string): void {
    this.deleteFromCollection(id);

    this.db.articles.forEach((article) => {
      if (article.authorId === id) {
        article.authorId = null;
      }
    });

    removeRelatedItems(this.db.comments, 'authorId', id);
  }
}
