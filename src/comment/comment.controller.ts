import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import { UuidValidationPipe } from 'src/common/uuid-validation.pipe';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll(@Query() query: GetCommentDto) {
    return await this.commentService.findAllCommentsByArticleId(query);
  }

  @Get(':id')
  async findOne(@Param('id', new UuidValidationPipe('Comment')) id: string) {
    return await this.commentService.findOne(id);
  }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.create(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new UuidValidationPipe('Comment')) id: string) {
    return await this.commentService.remove(id);
  }
}
