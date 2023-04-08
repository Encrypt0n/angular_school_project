import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { ResultService } from './result.service';

import { UserInfo, User, ResourceId, UserRegistration } from '@school-app/data';
import { InjectToken, Token } from '../auth/token.decorator';
import { Result } from './result.schema';
import { ResultBody } from './result.inteface';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get()
  async getAll(): Promise<Result[]> {
    return this.resultService.getAll();
  }

  @Post()
  async post(@Body() credentials: ResultBody): Promise<ResourceId> {
      try {
          
          //await this.authService.registerUser(credentials.firstName, credentials.lastName, credentials.emailAddress, credentials.password, credentials.role);
          console.log("credentials", credentials);
          return {
              id: await this.resultService.createResult(credentials.studentId, credentials.subject, credentials.grade, credentials.rating),
          };
      } catch (e) {
          console.log(e);
          throw new HttpException('Username invalid', HttpStatus.BAD_REQUEST);
      }
  }

  // this method should precede the general getOne method, otherwise it never matches
 /* @Get('self')
  async getSelf(@InjectToken() token: Token): Promise<Result> {
    const result = await this.resultService.getOne(token.);
    return result;
  }*/

  @Get('student/:id')
  async getAllByStudent(@Param('id') id: string): Promise<Result[]> {
    return this.resultService.getAllByStudent(id);
  }

  @Get(':studentId/:id')
  async getOne(@Param('studentId') studentId: string, @Param('id') id: string): Promise<Result> {
    console.log("studentId", studentId);
    
    return this.resultService.getOne(studentId, id);
  }

  
  @Delete(':studentId/:id')
  async deleteOne(@Param('studentId') studentId: string, @Param('id') id: string): Promise<string> {
    console.log("studentId", studentId);
    
    return this.resultService.deleteOne(studentId, id);
  }

  @Put(':studentId/:id')
  async updateOne(@Param('studentId') studentId: string, @Param('id') id: string, @Body() result: Result): Promise<Result> {
    return this.resultService.editOne(studentId, id, result);
  }

  
}