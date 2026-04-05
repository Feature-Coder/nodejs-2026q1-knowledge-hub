// src/comment/dto/get-comment.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class GetCommentDto extends PaginationQueryDto {
  @IsNotEmpty()
  @IsUUID('4')
  articleId: string;
}
