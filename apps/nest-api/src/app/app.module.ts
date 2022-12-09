import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';


import { MongooseModule } from '@nestjs/mongoose'
import { DataModule } from './data.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

require('dotenv');

@Module({
  imports: [
    
    MongooseModule.forRoot(`mongodb+srv://${process.env['MONGO_USR']}:${process.env['MONGO_PWD']}@school-app.mozyaav.mongodb.net/test`),
    AuthModule,
    DataModule,
    RouterModule.register([
      {
        path: 'auth-api',
        module: AuthModule,
      },
      {
        path: 'data-api',
        module: DataModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('data-api');
  }
}
