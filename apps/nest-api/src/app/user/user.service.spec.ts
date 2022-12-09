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


  

  const testUsers = [
  {
    id: '1',
    firstName: 'dion',
    lastName: 'koeze',
    emailAddress: 'mail@address.com',
    role: 'teacher'
  }, {
    id: '2',
    firstName: 'davide',
    lastName: 'ambesi',
    emailAddress: 'mail@address.com',
    role: 'teacher'
  }];
  
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





    await Promise.all([user1.save(), user2.save()]);
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
      expect(results.map(r => r.firstName)).toContain('dion');
      expect(results.map(r => r.firstName)).toContain('davide');
    });
    



  });

  describe('getOne', () => {
    it('should retrieve a specific user', async () => {
      const result = await service.getOne('1');

      expect(result).toHaveProperty('firstName', 'dion');
    });
    
    it('returns null when user is not found', async () => {
      const result = await service.getOne('niemand');
      
      expect(result).toBeUndefined();
    });
    
   
    

    
  });
});
