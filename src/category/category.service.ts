import { Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGES } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import type { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page, limit, sortBy, order } = query;
    const orderBy = sortBy ? { [sortBy]: order || 'asc' } : undefined;

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;

      const [total, categories] = await Promise.all([
        this.prisma.category.count(),
        this.prisma.category.findMany({ skip, take: limit, orderBy }),
      ]);

      return {
        total,
        page,
        limit,
        data: categories.map((c) => new CategoryEntity(c)),
      };
    }

    const categories = await this.prisma.category.findMany({ orderBy });
    return categories.map((c) => new CategoryEntity(c));
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('Category'));
    }
    return new CategoryEntity(category);
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({ data: dto });
    return new CategoryEntity(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const categoryExists = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!categoryExists) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('Category'));
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: dto,
    });
    return new CategoryEntity(category);
  }

  async remove(id: string) {
    const categoryExists = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!categoryExists) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('Category'));
    }

    await this.prisma.category.delete({ where: { id } });
  }
}
