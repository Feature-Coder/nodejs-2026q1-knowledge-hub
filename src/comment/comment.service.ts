import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MESSAGES } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCommentsByArticleId(query: GetCommentDto) {
    const { articleId, page, limit, sortBy, order } = query;
    const orderBy = sortBy ? { [sortBy]: order || 'asc' } : undefined;
    const where = { articleId };

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;

      const [total, comments] = await Promise.all([
        this.prisma.comment.count({ where }),
        this.prisma.comment.findMany({ skip, take: limit, orderBy, where }),
      ]);

      return {
        total,
        page,
        limit,
        data: comments.map((c) => new CommentEntity(c)),
      };
    }

    const comments = await this.prisma.comment.findMany({ where, orderBy });
    return comments.map((c) => new CommentEntity(c));
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('Comment'));
    }
    return new CommentEntity(comment);
  }

  async create(dto: CreateCommentDto) {
    const articleExists = await this.prisma.article.findUnique({
      where: { id: dto.articleId },
    });
    if (!articleExists) {
      throw new UnprocessableEntityException(
        MESSAGES.RELATION_NOT_FOUND('Article'),
      );
    }

    const comment = await this.prisma.comment.create({ data: dto });
    return new CommentEntity(comment);
  }

  async remove(id: string) {
    const commentExists = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!commentExists) {
      throw new NotFoundException(MESSAGES.NOT_FOUND('Comment'));
    }

    await this.prisma.comment.delete({ where: { id } });
  }
}
