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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UuidValidationPipe } from 'src/common/uuid-validation.pipe';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', new UuidValidationPipe('User')) id: string) {
    return await this.userService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', new UuidValidationPipe('User')) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new UuidValidationPipe('User')) id: string) {
    return await this.userService.remove(id);
  }
}
