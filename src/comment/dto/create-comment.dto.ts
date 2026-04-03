import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID('4')
  @IsOptional()
  authorId?: string | null;

  @IsUUID('4')
  @IsNotEmpty()
  articleId: string;
}
