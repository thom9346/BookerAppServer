import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { GetUserArgs } from './dto/args/get-user-args.dto';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { UserRepository } from './models/users.repository';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './models/user.schema';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(createUserData: CreateUserInput) {
    await this.validateCreateUserData(createUserData);
    const userDocument = await this.userRepository.create({
        ...createUserData, 
        password: await bcrypt.hash(createUserData.password, 10),
    });
    return this.toModel(userDocument);
  }

  private async validateCreateUserData(createUserData: CreateUserInput) {
    try {
      await this.userRepository.findOne({ email: createUserData.email });
      throw new UnprocessableEntityException('Email already exists.')
    } catch (err) {}
  }

  async getUser(getUserArgs: GetUserArgs) {
    const userDocument = await this.userRepository.findOne(getUserArgs);
    return this.toModel(userDocument);
  }

  private toModel(userDocument: UserDocument): User {
    return {
        _id: userDocument._id.toHexString(),
        email: userDocument.email,
    }
  }
}
