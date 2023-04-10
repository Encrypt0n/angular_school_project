import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Delete } from '@nestjs/common';

import { EducationService } from './education.service';

import { UserInfo, User, ResourceId, UserRegistration } from '@school-app/data';
import { InjectToken, Token } from '../auth/token.decorator';
import { EducationDocument } from './education.schema';
import { Education } from '@school-app/data';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async getAll(): Promise<Education[]> {
    return this.educationService.getAll();
  }

  @Post()
  async post(@Body() credentials: Education): Promise<ResourceId> {
      try {
          
          //await this.authService.registerUser(credentials.firstName, credentials.lastName, credentials.emailAddress, credentials.password, credentials.role);
          //console.log("credentials", credentials);
          return {
              id: await this.educationService.createEducation(credentials.name, credentials.description),
          };
      } catch (e) {
          console.log(e);
          throw new HttpException('Username invalid', HttpStatus.BAD_REQUEST);
      }
  }

  // this method should precede the general getOne method, otherwise it never matches
  @Get('self')
  async getSelf(@InjectToken() token: Token): Promise<EducationDocument> {
    const result = await this.educationService.getOne(token.id);
    return result;
  }

  @Get('finished/:education/:subject')
  async getFinishedSubjects(@Param('education') education: string, @Param('subject') subject: string): Promise<Education[]> {
    return await this.educationService.getFinishedSubjects(education, subject);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<EducationDocument> {
    return this.educationService.getOne(id);
  }
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() education: Education): Promise<EducationDocument> {
    console.log("education", education);
    return this.educationService.editOne(id, education);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<EducationDocument> {
    return this.educationService.deleteOne(id);
  }
}