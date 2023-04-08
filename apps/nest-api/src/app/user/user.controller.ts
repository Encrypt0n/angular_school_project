import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';

import { UserService } from './user.service';

import { UserInfo, User } from '@school-app/data';
import { InjectToken, Token } from '../auth/token.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<UserInfo[]> {
    return this.userService.getAll();
  }

  // this method should precede the general getOne method, otherwise it never matches
  @Get('self')
  async getSelf(@InjectToken() token: Token): Promise<User> {
    const result = await this.userService.getOne(token.id);
    return result;
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<User> {
    return this.userService.getOne(id);
  }
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.editOne(id, user);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<User> {
    return this.userService.deleteOne(id);
  }
}
