import { Request } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create.user';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userSrv: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [User],
    description: 'Get all users',
    headers: {
      'X-Total-Count': {
        description: 'Total number of users',
        schema: { type: 'integer' },
      },
    },
  })
  async findAll(@Req() req: Request) {
    const [users, count] = await Promise.all([
      this.userSrv.findAll(),
      this.userSrv.count(),
    ]);

    // Set the header outside of the return statement
    req.res.set('X-Total-Count', count.toString());

    return users;
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: User,
    description: 'Get a user by id',
  })
  async findOne(@Param('id') id: number) {
    return this.userSrv.findOneByIdOrFail(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    type: User,
    description: 'Create a user',
  })
  async create(@Body() user: CreateUserDto) {
    return this.userSrv.create(user);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: User,
    description: 'Update a user',
  })
  async update(@Param('id') id: number, @Body() user: CreateUserDto) {
    return this.userSrv.updateById(id, user);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'Delete a user' })
  async delete(@Param('id') id: number) {
    return this.userSrv.deleteById(id);
  }
}
