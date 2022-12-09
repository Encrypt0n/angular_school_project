import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User } from '@school-app/data';
import { UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { Identity, IdentitySchema } from './auth/identity.schema';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Identity.name, schema: IdentitySchema }
        ]),
    ],
    controllers: [UserController, AuthController],
    providers: [UserService, AuthService],
})
export class DataModule { }
