import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Delete } from '@nestjs/common';

import { SubjectService } from './subject.service';

import { UserInfo, User, ResourceId, UserRegistration } from '@school-app/data';
import { InjectToken, Token } from '../auth/token.decorator';
import { SubjectDocument } from './subject.schema';
import { SubjectBody } from './subject.inteface';
import { Subject } from '@school-app/data';


@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async getAll(): Promise<SubjectDocument[]> {
    return this.subjectService.getAll();
  }

  @Post()
  async post(@Body() credentials: SubjectBody): Promise<ResourceId> {
      try {
          
          //await this.authService.registerUser(credentials.firstName, credentials.lastName, credentials.emailAddress, credentials.password, credentials.role);
          //console.log("credentials", credentials);
          return {
              id: await this.subjectService.createSubject(credentials.name, credentials.description, credentials.credits, credentials.education),
          };
      } catch (e) {
          console.log(e);
          throw new HttpException('Username invalid', HttpStatus.BAD_REQUEST);
      }
  }

  // this method should precede the general getOne method, otherwise it never matches
  @Get('self')
  async getSelf(@InjectToken() token: Token): Promise<SubjectDocument> {
    const result = await this.subjectService.getOne(token.id);
    return result;
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<SubjectDocument> {
    return this.subjectService.getOne(id);
  }
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() subject: Subject): Promise<SubjectDocument> {
    console.log("subject", subject);
    return this.subjectService.editOne(id, subject);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SubjectDocument> {
    return this.subjectService.deleteOne(id);
  }
}