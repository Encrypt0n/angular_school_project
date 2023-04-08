import { Test } from '@nestjs/testing';

import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { validate, version } from 'uuid';

import { User, UserDocument, UserSchema } from "./user.schema";

describe('User Schema', () => {
  let mongod: MongoMemoryServer;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            return {uri};
          },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
    }).compile();

    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

    // not entirely sure why we need to wait for this...
    // https://github.com/nodkz/mongodb-memory-server/issues/102
    await userModel.ensureIndexes();
  });

  afterAll(async () => {
    await disconnect();
    await mongod.stop();
  });

  it('has a default uuid v4 as id', () => {
    const model = new userModel();

    expect(validate(model.id)).toBeTruthy();
    expect(version(model.id)).toBe(4);
  });





  it('has a required emailaddress', () => {
    const model = new userModel();

    const err = model.validateSync();

    expect(err.errors.emailAddress).toBeInstanceOf(Error);
  });

  it('has a unique emailaddress', async () => {
    const original = new userModel({firstName: 'frank', lastName: "linden", emailAddress: 'frank@frank.nl', role: 'student'});
    const duplicate = new userModel({firstName: 'frank', lastName: "linden", emailAddress: 'frank@frank.nl', role: 'student'});

    await original.save();

    await expect(duplicate.save()).rejects.toThrow();
  });



 
});