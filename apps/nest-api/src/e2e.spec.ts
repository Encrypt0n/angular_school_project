import request = require('supertest');

import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, MiddlewareConsumer, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { UserRegistration } from '@school-app/data';

import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from "mongodb-memory-server";
import { disconnect } from "mongoose";

import { AuthModule } from './app/auth/auth.module';
import { DataModule } from './app/data.module';
import { TokenMiddleware } from './app/auth/token.middleware';
import { ApiResponseInterceptor } from './app/api-response.interceptor';
import { Neo4jModule } from './app/neo4j/neo4j.module';

let mongod: MongoMemoryServer;
let uri: string;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        return {uri};
      },
    }),
    AuthModule,
    DataModule,
    RouterModule.register([{
      path: 'auth-api',
      module: AuthModule,
    }, {
      path: 'data-api',
      module: DataModule,
    }]),
    Neo4jModule.forRoot({
        scheme: 'neo4j+s',
        host: process.env['NEO4J_HOST'] || '',
      username: process.env['NEO4J_USR']  || '',
      password: process.env['NEO4J_PWD']  || '',
      database: process.env['NEO4J_DB']  || '',
    })
  ],
  controllers: [],
  providers: [
 
  ],
})
export class TestAppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(TokenMiddleware)
    .forRoutes('data-api')
  }
}

describe('end-to-end tests of data API', () => {
  let app: INestApplication;
  let server;
  let module: TestingModule; 
  let mongoc: MongoClient;
  
  beforeAll(async () => {
    // sadly I have not found a way to override the Mongoose connection of the AppModule,
    // so here we duplicate the config of the AppModule...
    // contact me if you know how to do this better!
    // https://github.com/nestjs/nest/issues/4905
    module = await Test.createTestingModule({
        imports: [TestAppModule], 
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalInterceptors(new ApiResponseInterceptor());
    await app.init();

    mongoc = new MongoClient(uri);
    await mongoc.connect();

    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('identities').deleteMany({});
    await mongoc.db('test').collection('users').deleteMany({});
    await mongoc.db('test').collection('educations').deleteMany({});
    await mongoc.db('test').collection('subjects').deleteMany({});
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('single user', () => {
    let credentials: UserRegistration;

    beforeEach(() => {
      credentials = {
        firstName: 'dion',
        lastName: 'koeze',
        password: 'supergeheim123',
        emailAddress: 'dion@dion.nl',
        role: 'teacher'
      };
    });

    it('a user registers, logs in, and has no meetups', async () => {
      const register = await request(server)
        .post('/auth-api/register')
        .send(credentials);
        
      expect(register.status).toBe(201);
      expect(register.body).toHaveProperty('results');
      expect(register.body.results).toHaveProperty('id');
      expect(register.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
  
      const login = await request(server)
        .post('/auth-api/login')
        .send(credentials);
  
      expect(login.status).toBe(201);
      expect(login.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(login.body).toHaveProperty('results.token');
  
      const token = login.body.results.token;
  
      const educations = await request(server)
        .get('/data-api/education')
        .set('authorization', token);
  
      expect(educations.status).toBe(200);
      expect(educations.body).toHaveProperty('info', {version: '1.0', type: 'list', count: 0});
      expect(educations.body).toHaveProperty('results', []);
    });

    it('user registers, logs in, sets education, education is found, removes education, education is found, looks up own account info', async () => {
      const testEducation = {name: 'CMD', description: 'media development'};
      

      const register = await request(server)
        .post('/auth-api/register')
        .send(credentials);

      expect(register.status).toBe(201);
      expect(register.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(register.body).toHaveProperty('results.id');
  
      const login = await request(server)
        .post('/auth-api/login')
        .send(credentials);
  
      expect(login.status).toBe(201);
      expect(login.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(login.body).toHaveProperty('results.token');
  
      const token = login.body.results.token;
      
      const setTestEducation = await request(server)
        .post('/data-api/education')
        .set('authorization', token)
        .send(testEducation);
      
      expect(setTestEducation.status).toBe(201);
      expect(setTestEducation.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});

      console.log(setTestEducation.body);
      

        

      const getEducations = await request(server)
        .get('/data-api/education')
        .set('authorization', token);
        
      expect(getEducations.status).toBe(200);
      expect(getEducations.body).toHaveProperty('info', {version: '1.0', type: 'list', count: 1});
      expect(getEducations.body).toHaveProperty('results');
      expect(getEducations.body.results).toHaveLength(1);
      expect(getEducations.body.results.map(t => t.name)).toContain(testEducation.name);
      expect(getEducations.body.results[0]).toHaveProperty('id');

      const getSelf1 = await request(server)
        .get('/data-api/user/self')
        .set('authorization', token);
        
      expect(getSelf1.status).toBe(200);
      expect(getSelf1.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(getSelf1.body).toHaveProperty('results');
      expect(getSelf1.body.results).toHaveProperty('id');
      expect(getSelf1.body.results).toHaveProperty('firstName', credentials.firstName);
      expect(getSelf1.body.results).toHaveProperty('lastName', credentials.lastName);
      expect(getSelf1.body.results).toHaveProperty('results', []);
      expect(getSelf1.body.results).toHaveProperty('role', credentials.role);
      expect(getSelf1.body.results).toHaveProperty('emailAddress', credentials.emailAddress);

      console.log(setTestEducation.body.results.id);
      

      const testEducationId = setTestEducation.body.results.id;



      const removeTestEducation = await request(server)
        .delete('/data-api/education/'+testEducationId)
        .set('authorization', token)
     
      console.log(removeTestEducation.body);
      
      expect(removeTestEducation.status).toBe(200);
      expect(removeTestEducation.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});

     
      
  


    });
  });

  describe('two users', () => {
    let credsA, credsB;

    beforeEach(() => {
      credsA = {
        firstName: 'erik',
        lastName: 'kuiper',
        password: 'supergeheim123', // ik heb altijd hetzelfde wachtwoord als jan...
        emailAddress: 'erik@erik.nl',
        role: 'teacher'
      };

      credsB = {
        firstName: 'jan',
        lastName: 'janssen',
        password: 'supergeheim123',
        emailAddress: 'jan@jan.nl',
        role: 'teacher'
      };
    });

    it('three users register, log in, set topics, fix a meetup, tutor sees invite, tutor accepts, tutor and pupil see the meetup, third user does not see meetup, pupil leaves a review, tutor looks at review', async () => {
      const educationA = {name: 'Informatica', description: 'leuke opleiding'};
      const educationB = {name: 'Technische Informatica', description: 'saaie opleiding'};

      const credsC = {
        firstName: 'ruud',
        lastName: 'hermans',
        password: 'noggeheimer321',
        emailAddress: 'ruud@ruud.nl',
        role: 'teacher'
      };

      const registerA = await request(server)
        .post('/auth-api/register')
        .send(credsA);

      expect(registerA.status).toBe(201);
      expect(registerA.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(registerA.body).toHaveProperty('results.id');
  
      const registerB = await request(server)
        .post('/auth-api/register')
        .send(credsB);
      
      expect(registerB.status).toBe(201);
      expect(registerB.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(registerB.body).toHaveProperty('results.id');

      const registerC = await request(server)
        .post('/auth-api/register')
        .send(credsC);
      
      expect(registerC.status).toBe(201);
      expect(registerC.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(registerC.body).toHaveProperty('results.id');

      const loginA = await request(server)
        .post('/auth-api/login')
        .send(credsA);
  
      expect(loginA.status).toBe(201);
      expect(loginA.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(loginA.body).toHaveProperty('results.token');
      
      const loginB = await request(server)
        .post('/auth-api/login')
        .send(credsB);
      
      expect(loginB.status).toBe(201);
      expect(loginB.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(loginB.body).toHaveProperty('results.token');

      const loginC = await request(server)
        .post('/auth-api/login')
        .send(credsC);
      
      expect(loginC.status).toBe(201);
      expect(loginC.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(loginC.body).toHaveProperty('results.token');
      
      const tokenA = loginA.body.results.token;
      const tokenB = loginB.body.results.token;
      const tokenC = loginC.body.results.token;
      const idA = registerA.body.results.id;
      const idB = registerB.body.results.id;
      const idC = registerC.body.results.id;

      const setEducationA = await request(server)
        .post('/data-api/education')
        .set('authorization', tokenA)
        .send(educationA);

      expect(setEducationA.status).toBe(201);
      expect(setEducationA.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});

      const educationIdA = setEducationA.body.results.id;
      
      const setEducationB = await request(server)
        .post('/data-api/education')
        .set('authorization', tokenB)
        .send(educationB);

      expect(setEducationB.status).toBe(201);
      expect(setEducationB.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});

      let subject = {name: 'Programmeren 1', description: 'beginnende programmeerskills', credits: 3, education: educationIdA};

      const createSubject = await request(server)
        .post('/data-api/subject')
        .set('authorization', tokenA)
        .send(subject);
      
      expect(createSubject.status).toBe(201);
      expect(createSubject.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(createSubject.body).toHaveProperty('results.id');

  

      const checkEducationList = await request(server)
        .get('/data-api/education')
        .set('authorization', tokenC);
        
      expect(checkEducationList.status).toBe(200);
      expect(checkEducationList.body).toHaveProperty('info', {version: '1.0', type: 'list', count: 2});
      expect(checkEducationList.body).toHaveProperty('results');
      expect(checkEducationList.body.results).toHaveLength(2);
      expect(checkEducationList.body.results.filter(u => u.id == educationIdA)[0]).toHaveProperty('name', educationA.name);
      

      
  
    });
  
    it('two users register, log in, get list of users and their own account info', async () => {
      const registerA = await request(server)
        .post('/auth-api/register')
        .send(credsA);

      expect(registerA.status).toBe(201);
      expect(registerA.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(registerA.body).toHaveProperty('results.id');
  
      const registerB = await request(server)
        .post('/auth-api/register')
        .send(credsB);
      
      expect(registerB.status).toBe(201);
      expect(registerB.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(registerB.body).toHaveProperty('results.id');

      const loginA = await request(server)
        .post('/auth-api/login')
        .send(credsA);
  
      expect(loginA.status).toBe(201);
      expect(loginA.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(loginA.body).toHaveProperty('results.token');
      
      const loginB = await request(server)
        .post('/auth-api/login')
        .send(credsB);
      
      expect(loginB.status).toBe(201);
      expect(loginB.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(loginB.body).toHaveProperty('results.token');
      
      const tokenA = loginA.body.results.token;
      const tokenB = loginB.body.results.token;

      const getUserListA = await request(server)
        .get('/data-api/user')
        .set('authorization', tokenA);

      expect(getUserListA.status).toBe(200);
      expect(getUserListA.body).toHaveProperty('info', {version: '1.0', type: 'list', count: 2});
      expect(getUserListA.body).toHaveProperty('results');
      expect(getUserListA.body.results).toHaveLength(2);
      expect(getUserListA.body.results[0]).toHaveProperty('id');
      expect(getUserListA.body.results[0]).toHaveProperty('firstName');
      expect(getUserListA.body.results[0]).toHaveProperty('lastName');
      expect(getUserListA.body.results[0]).toHaveProperty('results');
      expect(getUserListA.body.results[0]).toHaveProperty('role');
      expect(getUserListA.body.results[0]).toHaveProperty('emailAddress');
      expect(getUserListA.body.results.map(u => u.firstName)).toContain(credsA.firstName);
      expect(getUserListA.body.results.map(u => u.firstName)).toContain(credsB.firstName);

      const getUserListB = await request(server)
        .get('/data-api/user')
        .set('authorization', tokenB);

        expect(getUserListB.status).toBe(200);
        expect(getUserListB.body).toHaveProperty('info', {version: '1.0', type: 'list', count: 2});
        expect(getUserListB.body).toHaveProperty('results');
        expect(getUserListB.body.results).toHaveLength(2);
        expect(getUserListB.body.results[0]).toHaveProperty('id');
        expect(getUserListB.body.results[0]).toHaveProperty('firstName');
        expect(getUserListB.body.results[0]).toHaveProperty('lastName');
        expect(getUserListB.body.results[0]).toHaveProperty('results');
        expect(getUserListB.body.results[0]).toHaveProperty('role');
        expect(getUserListB.body.results[0]).toHaveProperty('emailAddress');
        expect(getUserListB.body.results.map(u => u.firstName)).toContain(credsA.firstName);
        expect(getUserListB.body.results.map(u => u.firstName)).toContain(credsB.firstName);
  

      const getSelfA = await request(server)
        .get('/data-api/user/self')
        .set('authorization', tokenA);

      expect(getSelfA.status).toBe(200);
      expect(getSelfA.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(getSelfA.body).toHaveProperty('results');
      expect(getSelfA.body.results).toHaveProperty('id');
      expect(getSelfA.body.results).toHaveProperty('firstName', credsA.firstName);
      expect(getSelfA.body.results).toHaveProperty('lastName', credsA.lastName);
      expect(getSelfA.body.results).toHaveProperty('results', []);
      expect(getSelfA.body.results).toHaveProperty('role', credsA.role);
      expect(getSelfA.body.results).toHaveProperty('emailAddress', credsA.emailAddress);

      const getSelfB = await request(server)
        .get('/data-api/user/self')
        .set('authorization', tokenB);

      expect(getSelfB.status).toBe(200);
      expect(getSelfB.body).toHaveProperty('info', {version: '1.0', type: 'object', count: 1});
      expect(getSelfB.body).toHaveProperty('results');
      expect(getSelfB.body.results).toHaveProperty('id');
      expect(getSelfB.body.results).toHaveProperty('firstName', credsB.firstName);
      expect(getSelfB.body.results).toHaveProperty('lastName', credsB.lastName);
      expect(getSelfB.body.results).toHaveProperty('results', []);
      expect(getSelfB.body.results).toHaveProperty('role', credsB.role);
      expect(getSelfB.body.results).toHaveProperty('emailAddress', credsB.emailAddress);
    });
  });  
});