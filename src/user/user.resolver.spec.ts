import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

const mockData = {
  id: 'd2e43568-4867-406f-aa1b-c6f0d7a73154',
  email: 'any@email.com',
  name: 'any',
};

describe('UserResolver', () => {
  let resolver;
  let service;

  const serviceFactory = {
    findAllUsers: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useFactory: () => serviceFactory,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  describe('findAllUsers()', () => {
    it('should be called service.findAllUsers', async () => {
      await resolver.users();
      expect(service.findAllUsers).toBeCalled();
    });

    it('should be returns service.findAllUsers return', async () => {
      (service.findAllUsers as jest.Mock).mockReturnValue([mockData]);
      expect(await resolver.users()).toEqual([mockData]);
    });
  });

  describe('getUserById()', () => {
    it('should be called service.findOne with correct email', async () => {
      await resolver.user(mockData.id);
      expect(service.getUserById).toBeCalledWith(mockData.id);
    });

    it('should be returns service.findOne return', async () => {
      (service.getUserById as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.user(mockData.id)).toEqual(mockData);
    });
  });

  describe('createUser()', () => {
    it('should be called service.create with correct params', async () => {
      await resolver.createUser(mockData);
      expect(service.createUser).toBeCalledWith(mockData);
    });

    it('should be returns service.create return', async () => {
      (service.createUser as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.createUser(mockData)).toEqual(mockData);
    });
  });


  describe('updateUser()', () => {
    it('should be called service.update with correct params', async () => {
      await resolver.updateUser(mockData.id, mockData);
      expect(service.updateUser).toBeCalledWith(mockData);
    });

    it('should be returns service.create return', async () => {
      (service.updateUser as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.updateUser(mockData.id, mockData)).toEqual(mockData);
    });
  });

  describe('deleteUser()', () => {
    it('should be called service.deleteUser with correct email', async () => {
      await resolver.deleteUser(mockData.id);
      expect(service.deleteUser).toBeCalledWith(mockData.id);
    });

    it('should be returns service.deleteUser return', async () => {
      (service.deleteUser as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.deleteUser(mockData.id)).toEqual(true);
    });
  });


});
