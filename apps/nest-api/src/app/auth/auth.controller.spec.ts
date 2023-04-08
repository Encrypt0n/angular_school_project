import { Token } from '@school-app/data';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let app: TestingModule;
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ // mock the auth service, to avoid providing its dependencies
        provide: AuthService,
        useValue: {
          createUser: jest.fn(),
          registerUser: jest.fn(),
          generateToken: jest.fn(),
        },
      }],
    }).compile();

   authController = app.get<AuthController>(AuthController);
   authService = app.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    let exampleUser, exampleId, register, create;

    beforeEach(() => {
      exampleUser = {
        firstName: 'Henk',
        lastName: 'Jansen',
        emailAddress: 'henk@email.com',
        password: 'Welkom01',
        role: 'student',
      }
      exampleId = '2';

      create = jest.spyOn(authService, 'createUser')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation(async (_u: string) => {return exampleId;});
    });

    it('should call the register and create method of the auth service on success', async () => {
      register = jest.spyOn(authService, 'registerUser')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation(async (_u: string, _p: string) => {return;});

      const id = await authController.register(exampleUser);

      expect(register).toHaveBeenCalledWith(exampleUser.firstName, exampleUser.lastName, exampleUser.emailAddress, exampleUser.password, exampleUser.role);
      expect(create).toHaveBeenCalledWith(exampleUser.firstName, exampleUser.lastName, exampleUser.emailAddress, exampleUser.role);
      expect(id).toHaveProperty('id', exampleId);
    });

    it('should not call create on failed register (duplicate username)', async () => {
      register = jest.spyOn(authService, 'registerUser')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation(async (_u: string, _p: string) => {throw new Error('duplicate user');});

      await expect(authController.register(exampleUser)).rejects.toThrow();
      expect(create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should call the generateToken method of the auth service', async () => {
      const exampleUser = {
        emailAddress: 'henk@email.com',
        password: 'Welkom01',
       
      };
      const mockedToken: Token = {token: 'mockedToken'};

      const register = jest.spyOn(authService, 'generateToken')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation(async (_u: string, _p: string) => {return mockedToken.token;});

      expect(await authController.login(exampleUser)).toStrictEqual(mockedToken);

      expect(register).toHaveBeenCalledWith(exampleUser.emailAddress, exampleUser.password);
    });
  });
});
