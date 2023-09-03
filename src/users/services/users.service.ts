import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.entity';
import * as bcrypt from 'bcrypt';
import { Model, QueryWithHelpers } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import Role from '../../roles/enums/role.enum';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private async transformBody(dto: CreateUserDto | UpdateUserDto) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
  }

  public async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email.toLowerCase() }, [
      '+password',
    ]);
  }

  public async findByName(username: string): Promise<User> {
    return this.userModel.findOne({ username: username.toLowerCase() });
  }

  public async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const rawData = { ...dto, roles: [Role.USER] };

    await this.transformBody(rawData);

    const created = await this.userModel.create(rawData);

    return new UserResponseDto(created);
  }

  public async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find();
    return users.map((user) => new UserResponseDto(user));
  }

  private async findUserByID(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async findOne(_id: string): Promise<UserResponseDto> {
    const user = await this.findUserByID(_id);
    return new UserResponseDto(user);
  }

  public async findRolesOfUser(_id: string): Promise<Role[]> {
    const user = await this.userModel.findOne({ _id }, ['roles']);
    return user.roles;
  }

  public async update(
    _id: string,
    dto: UpdateUserDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findUserByID(_id);

    const rawData = { ...dto };

    await this.transformBody(rawData);

    return this.userModel.updateOne({ _id }, rawData);
  }

  public async remove(_id: string): Promise<void> {
    await this.findUserByID(_id);
    await this.userModel.deleteOne({ _id });
  }

  public async comparePass(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
