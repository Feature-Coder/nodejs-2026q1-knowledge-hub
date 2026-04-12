import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UuidValidationPipe } from 'src/common/uuid-validation.pipe';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.categoryService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', new UuidValidationPipe('Category')) id: string) {
    return await this.categoryService.findOne(id);
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  async update(
    @Param('id', new UuidValidationPipe('Category')) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new UuidValidationPipe('Category')) id: string) {
    return await this.categoryService.remove(id);
  }
}
