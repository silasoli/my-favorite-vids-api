import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.entity';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';

const userId = faker.database.mongodbObjectId();
const userEmail = faker.internet.email();
const userUsername = faker.internet.userName();
const userPassword = faker.internet.password();

const mockUser: User = {
  _id: userId,
  username: userUsername,
  email: userEmail,
  password: userPassword,
  privy: faker.datatype.boolean(),
  profile_picture: 'test-image.png',
  roles: [],
  createdAt: new Date(),
};

const userModelMock: Partial<Model<UserDocument>> = {
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id === userId) return mockUser;
    return null;
  }),
  updateOne: jest.fn().mockImplementation((query, update) => {
    if (query._id === userId) {
      Object.assign(mockUser, update);
      return { nModified: 1 };
    }
    return { nModified: 0 };
  }),
  deleteOne: jest.fn().mockImplementation((query) => {
    if (query._id === userId) {
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }),
};

const usersServiceMock: Partial<UsersService> = {
  findByEmail: jest.fn().mockImplementation((email) => {
    if (email === userEmail) return mockUser;
    return null;
  }),
  comparePass: jest.fn().mockImplementation((inputPassword, userPassword) => {
    return inputPassword === userPassword; // hash
  }),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findProfile', () => {
    it('should retrieve a user profile', async () => {
      const result = await userService.findProfile(userId);
      expect(result).toBeDefined();
      expect(result.email).toBe(mockUser.email);
    });
  });

  describe('updateProfile', () => {
    it('should update and retrieve a user profile', async () => {
      const updatedProfile = {
        username: 'newUsername',
        email: 'newEmail@example.com',
      };

      const result = await userService.updateProfile(userId, updatedProfile);
      expect(result).toBeDefined();
      expect(result.username).toBe(updatedProfile.username);
      expect(result.email).toBe(updatedProfile.email);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      await userService.deleteUser(userId, { password: userPassword });
      expect(userModelMock.deleteOne).toBeCalledWith({ _id: userId });
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      await expect(
        userService.deleteUser(userId, { password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateProfilePicture', () => {
    it('should update and retrieve the profile picture URL', async () => {
      const mockFile = {
        fieldname: 'test',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: '/dest',
        filename: 'test.png',
        path: '/path/to/test.png',
        size: 1000,
      };

      const result = await userService.updateProfilePicture(userId, {
        file: mockFile,
      });
      expect(result).toBe(mockFile.filename);
    });
  });

  describe('getProfilePicture', () => {
    it('should retrieve the profile picture path', async () => {
      const result = await userService.getProfilePicture(userId);
      expect(result).toContain(mockUser.profile_picture);
    });
  });
});
