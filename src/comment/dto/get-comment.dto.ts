// src/comment/dto/get-comment.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCommentDto {
  @IsNotEmpty()
  @IsUUID('4')
  articleId: string;
}
