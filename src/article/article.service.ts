import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MESSAGES } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import type { ArticleQueryDto } from './dto/article-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  private mapArticle(prismaArticle: any): ArticleEntity {
    const { tags, ...rest } = prismaArticle;
    return new ArticleEntity({
      ...rest,
      tags: tags?.map((t: any) => t.name) || [],
    });
  }

  async findAll(query: ArticleQueryDto) {
    const { status, categoryId, tag, page, limit, sortBy, order } = query;
    const orderBy = sortBy ? { [sortBy]: order || 'asc' } : undefined;

    const where: Prisma.ArticleWhereInput = {
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(tag &&
        tag.length > 0 && {
          AND: tag.map((t) => ({ tags: { some: { name: t } } })),
        }),
    };

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;

      const [total, articles] = await Promise.all([
        this.prisma.article.count({ where }),
        this.prisma.article.findMany({
          skip,
          take: limit,
          orderBy,
          where,
          include: { tags: true },
        }),
      ]);

      return {
        total,
        page,
        limit,
        data: articles.map((a) => this.mapArticle(a)),
      };
    }

    const articles = await this.prisma.article.findMany({
      where,
      orderBy,
      include: { tags: true },
    });
    return articles.map((a) => this.mapArticle(a));
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!article) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('Article'));
    }
    return this.mapArticle(article);
  }

  async create(dto: CreateArticleDto) {
    if (dto.authorId) {
      const author = await this.prisma.user.findUnique({
        where: { id: dto.authorId },
      });
      if (!author) {
        throw new UnprocessableEntityException(
          MESSAGES.RELATION_NOT_FOUND('Author'),
        );
      }
    }
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new UnprocessableEntityException(
          MESSAGES.RELATION_NOT_FOUND('Category'),
        );
      }
    }

    const { tags, ...data } = dto;

    const article = await this.prisma.article.create({
      data: {
        ...data,
        tags: tags
          ? {
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    return this.mapArticle(article);
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('Article'));
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new UnprocessableEntityException(
          MESSAGES.RELATION_NOT_FOUND('Category'),
        );
      }
    }

    const { tags, ...data } = dto;

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        ...data,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    return this.mapArticle(article);
  }

  async remove(id: string) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('Article'));
    }

    await this.prisma.article.delete({ where: { id } });
  }
}
