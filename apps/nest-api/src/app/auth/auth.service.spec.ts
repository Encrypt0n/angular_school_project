import { Test } from '@nestjs/testing';

import { MongooseModule } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { hashSync } from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';
import { MongoClient } from 'mongodb';

import { AuthService } from './auth.service';
import { Identity, IdentitySchema } from './identity.schema';
import { User, UserSchema } from '../user/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  
  beforeAll(async () => {
    let uri: string;
    
    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            return {uri};
          },
        }),
        MongooseModule.forFeature([{ name: Identity.name, schema: IdentitySchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [AuthService],
    }).compile();

    service = app.get<AuthService>(AuthService);

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('identities').deleteMany({});
  })

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const exampleUser = {firstName: 'mario', lastName: 'jansen', emailAddress: 'mario@mario.nl', role: 'student'};
  
      await service.createUser(exampleUser.firstName, exampleUser.lastName, exampleUser.emailAddress, exampleUser.role);
  
      const found = await mongoc.db('test').collection('users').findOne({emailAddress: exampleUser.emailAddress});
  
      expect(found.emailAddress).toBe(exampleUser.emailAddress);
    });
  });

  describe('verify token', () => {
    it('should accept a valid token', async () => {
      const examplePayload = {user: 'userid'} 

      const token = sign(examplePayload, process.env.JWT_SECRET);

      const verifiedToken = await service.verifyToken(token);

      expect(verifiedToken).toHaveProperty('user', examplePayload.user);
    });

    it('should throw on invalid token', async () => {
      const token = 'fake.fake.fake';

      await expect(service.verifyToken(token)).rejects.toThrow();
    });
  })

  describe('generate token', () => {
    it('should generate a token with user id', async () => {
      const exampleUser = {emailAddress: 'dion@avans.nl', password: 'ditisnietmijnwachtwoord'};

      await mongoc.db('test').collection('identities').insertOne({
        emailAddress: exampleUser.emailAddress,
        hash: hashSync(exampleUser.password, parseInt(process.env.SALT_ROUNDS, 10)),
      });
      await mongoc.db('test').collection('users').insertOne({
        emailAddress: exampleUser.emailAddress,
        id: '1',
      });

      const token = await service.generateToken(exampleUser.emailAddress, exampleUser.password);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should throw when user is not found', async () => {
      await expect(service.generateToken('notfound', 'verysecret')).rejects.toThrow();
    });

    it('should throw when user supplied incorrect password', async () => {
      const exampleUser = {emailAddress: 'harie@mail.com', password: 'password1'};

      await mongoc.db('test').collection('identities').insertOne({
        emailAddress: exampleUser.emailAddress,
        hash: hashSync(exampleUser.password, parseInt(process.env.SALT_ROUNDS, 10)),
      });

      await expect(service.generateToken(exampleUser.emailAddress, exampleUser.password + '2')).rejects.toThrow();
    });
  });

  describe('register user', () => {
    it('should register a new user', async () => {
      const exampleUser = {firstName: 'piet', lastName: 'klaasen', password: 'Welkom01', emailAddress: 'piet@mail.com', role: 'student'};

      await service.registerUser(exampleUser.firstName, exampleUser.lastName, exampleUser.emailAddress, exampleUser.password, exampleUser.role);

      const record = await mongoc.db("test").collection("identities").findOne({emailAddress: exampleUser.emailAddress});

      expect(record).toHaveProperty('emailAddress', exampleUser.emailAddress);
      expect(record).toHaveProperty('hash');
    });
  })
});
