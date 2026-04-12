import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { MESSAGES } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import type { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page, limit, sortBy, order } = query;
    const orderBy = sortBy ? { [sortBy]: order || 'asc' } : undefined;

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;

      const [total, users] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.findMany({ skip, take: limit, orderBy }),
      ]);

      return {
        total,
        page,
        limit,
        data: users.map((u) => new UserEntity(u)),
      };
    }

    const users = await this.prisma.user.findMany({ orderBy });
    return users.map((u) => new UserEntity(u));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('User'));
    }
    return new UserEntity(user);
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    return new UserEntity(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const rawUser = await this.prisma.user.findUnique({ where: { id } });

    if (!rawUser) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('User'));
    }

    if (rawUser.password !== dto.oldPassword) {
      throw new ForbiddenException(MESSAGES.OLD_PASSWORD_WRONG);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: dto.newPassword },
    });

    return new UserEntity(updatedUser);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('User'));
    }

    // Advanced Scope: Prisma transactions for complex data operations
    await this.prisma.$transaction(async (tx) => {
      await tx.article.updateMany({
        where: { authorId: id },
        data: { authorId: null },
      });
      await tx.comment.deleteMany({
        where: { authorId: id },
      });
      await tx.user.delete({ where: { id } });
    });
  }
}
