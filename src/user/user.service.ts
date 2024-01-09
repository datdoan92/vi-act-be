import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findOneByIdOrFail(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(user: Partial<User>): Promise<User> {
    const existingUser = await this.userRepo.findOneBy({ email: user.email });

    if (existingUser)
      throw new BadRequestException('User Email already exists');

    return this.userRepo.save(user);
  }

  async updateById(id: number, user: Partial<User>) {
    const userByEmail = await this.userRepo.findOneBy({ email: user.email });
    if (userByEmail && userByEmail.id !== id) {
      throw new BadRequestException('User Email already exists');
    }

    const result = await this.userRepo.update(id, user);
    if (!result.affected) throw new NotFoundException('User not found');

    return this.findOneByIdOrFail(id);
  }

  async deleteById(id: number) {
    const result = await this.userRepo.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async count(): Promise<number> {
    return this.userRepo.count();
  }
}
