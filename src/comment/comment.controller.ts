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
  findAll(@Query() query: GetCommentDto) {
    return this.commentService.findAllCommentsByArticleId(query);
  }

  @Get(':id')
  findOne(@Param('id', new UuidValidationPipe('Comment')) id: string) {
    return this.commentService.findOne(id);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new UuidValidationPipe('Comment')) id: string) {
    return this.commentService.remove(id);
  }
}
