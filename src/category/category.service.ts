import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
  constructor(db: DatabaseService) {
    super(db, db.categories, 'Category');
  }

  create(dto: CreateCategoryDto): CategoryEntity {
    const category = new CategoryEntity();
    Object.assign(category, {
      ...dto,
      id: randomUUID(),
    });
    this.collection.push(category);
    return category;
  }

  update(id: string, dto: UpdateCategoryDto): CategoryEntity {
    const category = this.findOne(id);
    Object.assign(category, dto);
    return category;
  }

  remove(id: string): void {
    this.deleteFromCollection(id);

    this.db.articles.forEach((article) => {
      if (article.categoryId === id) {
        article.categoryId = null;
      }
    });
  }
}
