import { Test } from '@nestjs/testing';

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model } from 'mongoose';
import { MongoClient } from 'mongodb';

import { UserService } from './user.service';
import { User, UserDocument, UserSchema } from './user.schema';


describe('UserService', () => {
  let service: UserService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let userModel: Model<UserDocument>;

  const testUsers = [{
   // id: 'jan123',
    firstName: 'jan',
    lastName: 'jansen',
    emailAddress: 'janjansen@address.com',
    role: 'teacher'
  }, {
   // id: 'dion123',
    firstName: 'dion',
    lastName: 'koeze',
    emailAddress: 'dionkoeze@address.com',
    role: 'teacher'
  }, {
    //id: 'davide123',
    firstName: 'davide',
    lastName: 'ambesi',
    emailAddress: 'davideambesi@address.com',
    role: 'student'	
  }];
  
  beforeAll(async () => {
    // eslint-disable-next-line prefer-const
    let uri = '';
    
    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            return {uri};
          },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UserService],
    }).compile();

    service = app.get<UserService>(UserService);
    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('users').deleteMany({});

    const user1 = new userModel(testUsers[0]);
    const user2 = new userModel(testUsers[1]);
    const user3 = new userModel(testUsers[2]);

    await Promise.all([user1.save(), user2.save(), user3.save()]);
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('getAll', () => {
    it('should retrieve all users', async () => {
      const results = await service.getAll();
  
      expect(results).toHaveLength(3);
      expect(results.map(r => r.firstName)).toContain('jan');
      expect(results.map(r => r.lastName)).toContain('jansen');
      expect(results.map(r => r.firstName)).toContain('dion');
      expect(results.map(r => r.lastName)).toContain('koeze');
      expect(results.map(r => r.firstName)).toContain('davide');
      expect(results.map(r => r.lastName)).toContain('ambesi');
   
    });

    it('gives the email, id, name', async () => {
      const results = await service.getAll();

      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('firstName');
      expect(results[0]).toHaveProperty('lastName');
      expect(results[0]).toHaveProperty('emailAddress');
      expect(results[0]).toHaveProperty('role');
    });
  });

  describe('getOne', () => {
    it('should retrieve a specific user', async () => {
      const results = await service.getAll();

      const result = await service.getOne(results[0].id);

      expect(result).toHaveProperty('firstName', 'jan');
    });
    
    it('returns null when user is not found', async () => {
      const result = await service.getOne('niemand');
      
      expect(result).toBeUndefined();
    });
  });
});