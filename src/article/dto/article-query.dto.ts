import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ArticleStatus } from '../article.types';

export class ArticleQueryDto {
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @IsOptional()
  @Transform(({ value: queryTags }) => {
    const tagsArray = Array.isArray(queryTags) ? queryTags : [queryTags];
    return tagsArray
      .map((tag) => tag?.toString().trim())
      .filter((tag) => tag && tag.length > 0);
  })
  @IsString({ each: true })
  @MinLength(1, { each: true })
  tag?: string[];
}
