import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User } from '@school-app/data';
import { UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { Identity, IdentitySchema } from './auth/identity.schema';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { SubjectService } from './subject/subject.service';
import { SubjectController } from './subject/subject.controller';
import { Subject } from '@school-app/data';
import { SubjectSchema } from './subject/subject.schema';
import { ResultService } from './result/result.service';
import { ResultController } from './result/result.controller';
import { ResultSchema } from './result/result.schema';
import { Result } from '@school-app/data';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Identity.name, schema: IdentitySchema },
            { name: Subject.name, schema: SubjectSchema },
            { name: Result.name, schema: ResultSchema },
        ]),
        MongooseModule.forFeatureAsync([
            {
                name: Result.name,
                useFactory: () => {
                  const schema = ResultSchema;
                  schema.plugin(require('mongoose-autopopulate'));
                  return schema;
                },
              },
        ])
    ],
    controllers: [UserController, AuthController, SubjectController, ResultController],
    providers: [UserService, AuthService, SubjectService, ResultService],
})
export class DataModule { }
