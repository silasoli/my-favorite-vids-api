import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserDocument } from '../schemas/user.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../dto/create-user.dto';
import Role from '../../roles/enums/role.enum';
import { UpdateUserDto } from '../dto/update-user.dto';

const _id: string = '64eba27123601b83fc5104cb';
const updatedId: string = '12eba14123601b83fc7105cc';

const user: CreateUserDto = {
  username: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  privy: faker.datatype.boolean(),
};

const updateDto: UpdateUserDto = {
  username: 'testing update',
  email: 'testingupdate@gmail.com',
};

const userUpdated = {
  _id: faker.database.mongodbObjectId(),
  username: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  privy: faker.datatype.boolean(),
  profile_picture: null,
  roles: [Role.USER],
  createdAt: new Date(),
  ...updateDto,
};

const userDB = {
  _id: faker.database.mongodbObjectId(),
  username: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  privy: faker.datatype.boolean(),
  profile_picture: null,
  roles: [Role.USER],
  createdAt: new Date(),
};

const usersList = [userDB];

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateUserDto) => {
              return {
                _id: faker.database.mongodbObjectId(),
                ...dto,
                profile_picture: null,
                roles: [Role.USER],
                createdAt: new Date(),
              };
            }),
            findOne: jest.fn().mockImplementation((_idSearch) => {
              if (_idSearch._id === _id) return { ...userDB, _id };

              if (_idSearch._id === updatedId) return { ...userUpdated, _id };

              return null;
            }),
            findById: jest.fn().mockImplementation((_idSearch: string) => {
              if (_idSearch === _id) return { ...userDB, _id };
              if (_idSearch === updatedId) return { ...userUpdated, _id };
              return null;
            }),
            findByEmail: jest.fn().mockResolvedValue(null),
            findByName: jest.fn().mockResolvedValue(null),            
            find: jest.fn().mockImplementation(() => {
              return usersList;
            }),
            updateOne: jest
              .fn()
              .mockImplementation((_id, dto: UpdateUserDto) => {
                return { ...userUpdated, ...dto };
              }),
            deleteOne: jest
              .fn()
              .mockResolvedValue({ n: 1, ok: 1, deletedCount: 1 }),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(userModel).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createdUser = await usersService.create(user);

      expect(userModel.create).not.toHaveBeenCalledWith(user);
      expect(createdUser.username).toBe(user.username);
      expect(createdUser.email).toBe(user.email);
      expect(createdUser.privy).toBe(user.privy);
      expect(createdUser.roles[0]).toBe('user');
    });
  });

  describe('findAll', () => {
    it('should findAll users', async () => {
      const findAllUser = await usersService.findAll();

      expect(findAllUser[0]._id).toBe(usersList[0]._id);
      expect(findAllUser[0].username).toBe(usersList[0].username);
      expect(findAllUser[0].email).toBe(usersList[0].email);
      expect(findAllUser[0].privy).toBe(usersList[0].privy);
      expect(findAllUser[0].roles).toBe(usersList[0].roles);
    });
  });

  describe('findOne', () => {
    it('should findOne a user', async () => {
      const findOneUser = await usersService.findOne(_id);

      expect(findOneUser._id).toBe(_id);
      expect(findOneUser.username).toBe(userDB.username);
      expect(findOneUser.email).toBe(userDB.email);
      expect(findOneUser.privy).toBe(userDB.privy);
    });

    it('dont should findOne a user', async () => {
      await expect(usersService.findOne('123456')).rejects.toThrowError(
        'User not found',
      );
    });
  });

  describe('findRolesOfUser', () => {
    it('should find roles of user', async () => {
      const findRolesOfUser = await usersService.findRolesOfUser(_id);

      expect(findRolesOfUser).toBe(userDB.roles);
      expect(findRolesOfUser[0]).toBe(userDB.roles[0]);
    });

    it('dont should find roles of user', async () => {
      await expect(usersService.findRolesOfUser('123456')).rejects.toThrowError(
        'User not found',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser = await usersService.update(updatedId, updateDto);

      expect(updatedUser.email).toBe(updateDto.email);
      expect(updatedUser.username).toBe(updateDto.username);
    });

    it('dont should update a user', async () => {
      await expect(
        usersService.update('123456', updateDto),
      ).rejects.toThrowError('User not found');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const removeUser = await usersService.remove(_id);

      expect(removeUser).toBe(undefined);
    });

    it('dont should remove a user', async () => {
      await expect(usersService.remove('123456')).rejects.toThrowError(
        'User not found',
      );
    });
  });
  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = faker.internet.email();
      (userModel as any).findByEmail.mockResolvedValue({ ...userDB, email });
      const userByEmail = await usersService.findByEmail(email);
      expect(userByEmail.email).toBe(email);
    });
  });
  
  describe('findByName', () => {
    it('should find a user by username', async () => {
      const username = faker.internet.userName(); 
      (userModel as any).findByName.mockResolvedValue({ ...userDB, username });
      const userByName = await usersService.findByName(username);
      expect(userByName.username).toBe(username);
    });
  });
});
