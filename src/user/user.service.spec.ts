import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

const mockData = {
  id: 'd2e43568-4867-406f-aa1b-c6f0d7a73154',
  email: 'any@email.com',
  name: 'any',
};

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search all Users', () => {
    it('Should list all users', async () => {
      service.findAllUsers();
      expect(mockRepository.find).toBeCalled();
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should be returns repository.find return', async () => {
      (mockRepository.find as jest.Mock).mockReturnValue([mockData]);
      expect(await service.findAllUsers()).toEqual([mockData]);
    });
  });

  describe('findOne()', () => {
    it('should be called repository.find', async () => {
      (mockRepository.findOne as jest.Mock).mockReturnValue(mockData);

      await service.getUserById(mockData.id);
      expect(mockRepository.findOne).toBeCalledWith(mockData.id);
    });

    it('should be returns repository.find return', async () => {
      (mockRepository.findOne as jest.Mock).mockReturnValue(mockData);
      expect(await service.getUserById(mockData.id)).toEqual(mockData);
    });

    it('Should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);

      const user = service.getUserById('3');

      expect(user).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith('3');
    });
  });

  describe('When create a user', () => {
    it('Should create a user', async () => {
      (mockRepository.create as jest.Mock).mockReturnValue(mockData);
      (mockRepository.save as jest.Mock).mockReturnValue(mockData);

      await service.createUser(mockData);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledWith(mockData);
      expect(await service.createUser(mockData)).toEqual(mockData);
    });

    it('Should return a exception when does not to create a user', async () => {
      (mockRepository.save as jest.Mock).mockReturnValueOnce(null);

      const user = service.createUser(null);

      expect(user).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('When update a user', () => {
    it('Should update a user', async () => {
      const mockUpdatedData = { ...mockData, name: 'updated data' };

      service.getUserById = jest.fn().mockReturnValueOnce(mockData);
      (mockRepository.save as jest.Mock).mockReturnValue(mockUpdatedData);

      expect(await service.updateUser(mockUpdatedData)).toEqual(
        mockUpdatedData,
      );
      expect(mockRepository.save).toBeCalledWith(mockUpdatedData);
    });

    it('Should return a exception when does not to find a user', async () => {
      const mockUpdatedData = { ...mockData, name: 'updated data' };

      mockRepository.findOne.mockReturnValue(null);

      const user = service.updateUser(mockUpdatedData);

      expect(user).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith('3');
    });
  });

  describe('remove()', () => {
    it('should be called repository.findOneAndDelete', async () => {
      service.getUserById = jest.fn().mockReturnValueOnce(mockData);
      (mockRepository.delete as jest.Mock).mockReturnValue(mockData);

      await service.deleteUser(mockData.id);
      expect(mockRepository.delete).toBeCalledWith(mockData);
    });

    it('should be throw if email not exists', () => {
      service.getUserById = jest.fn().mockReturnValueOnce(mockData);
      (mockRepository.delete as jest.Mock).mockReturnValue(null);

      expect(service.deleteUser(mockData.id)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

  });
});
