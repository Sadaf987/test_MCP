// src/infrastructure/persistence/typeorm/repositories/user.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';
import { User } from 'src/domain/users/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Username } from 'src/domain/users/value-objects/username.vo';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>
  ) {}

  async save(user: User): Promise<void> {
    const userEntity = new UserOrmEntity();
    if (user.id) {
      userEntity.id = user.id;
    }
    userEntity.username = user.username.value;
    userEntity.email = user.email;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;

    await this.userRepository.save(userEntity);
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) return null;
    return new User(userEntity.id, new Username(userEntity.username), userEntity.email, userEntity.createdAt, userEntity.updatedAt);
  }

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { username } });
    if (!userEntity) return null;
    return new User(userEntity.id, new Username(userEntity.username), userEntity.email, userEntity.createdAt, userEntity.updatedAt);
  }

  async findAll(): Promise<User[]> {
    const userEntities = await this.userRepository.find();
    return userEntities.map((entity) =>
      new User(entity.id, new Username(entity.username), entity.email, entity.createdAt, entity.updatedAt)
    );
  }
}
