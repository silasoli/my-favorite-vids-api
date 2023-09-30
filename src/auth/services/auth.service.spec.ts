import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../dto/user-login.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

const userEmail = faker.internet.email();
const userPassword = faker.internet.password();
const userId = faker.database.mongodbObjectId();
const userName = faker.internet.userName();

const mockUser = {
  _id: userId,
  username: userName,
  email: userEmail,
  password: userPassword, // verificar se é hash ou como é
};

const userLoginDto: UserLoginDto = {
  email: userEmail,
  password: userPassword,
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersServiceMock: Partial<UsersService>;
  let jwtServiceMock: Partial<JwtService>;

  usersServiceMock = {
    findByEmail: jest.fn().mockImplementation((email) => {
      if (email === userEmail) return mockUser;
      return null;
    }),
    comparePass: jest.fn().mockImplementation((inputPassword, userPassword) => {
      return inputPassword === userPassword; // verificar se é hash ou como é
    }),
  };

  jwtServiceMock = {
    sign: jest.fn().mockReturnValue('mocked_token'),
    verifyAsync: jest.fn().mockResolvedValue({ sub: userId, username: userName }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user based on email and password', async () => {
      const user = await authService.validateUser(userLoginDto);
      expect(user.email).toBe(mockUser.email);
      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(userLoginDto.email);
      expect(usersServiceMock.comparePass).toHaveBeenCalledWith(userLoginDto.password, mockUser.password);
    });

    it('should return null if email is not found', async () => {
      const result = await authService.validateUser({ ...userLoginDto, email: 'invalid@example.com' });
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const result = await authService.validateUser({ ...userLoginDto, password: 'incorrectPassword' });
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should login a user and return access token', async () => {
      const result = await authService.login(mockUser);
      expect(result.access_token).toBe('mocked_token');
      expect(jwtServiceMock.sign).toHaveBeenCalled();
    });
  });

  describe('decodeAccessToken', () => {
    it('should decode an access token', async () => {
      const payload = await authService.decodeAccessToken('mocked_token') as { sub: string };
expect(payload.sub).toBe(userId);
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('mocked_token');
    });
  });


});


