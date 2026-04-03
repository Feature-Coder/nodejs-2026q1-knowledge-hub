import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { ArticleStatus } from '../article.types';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsUUID('4')
  @IsOptional()
  categoryId?: string | null;

  @IsUUID('4')
  @IsOptional()
  authorId?: string | null;
}
