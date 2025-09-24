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

  async save(user: User): Promise<User> {
    const userEntity = new UserOrmEntity();
    if (user.id) {
      userEntity.id = user.id;
    }
    userEntity.username = user.username.value;
    userEntity.email = user.email;
    userEntity.passwordHash = user.passwordHash;
    userEntity.city = user.city;
    userEntity.dateOfBirth = user.dateOfBirth;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;

    const savedEntity = await this.userRepository.save(userEntity);
    
    return new User(
      savedEntity.id,
      new Username(savedEntity.username),
      savedEntity.email,
      savedEntity.passwordHash,
      savedEntity.city,
      savedEntity.dateOfBirth,
      savedEntity.createdAt,
      savedEntity.updatedAt
    );
  }

  async update(user: User): Promise<User> {
    const userEntity = new UserOrmEntity();
    userEntity.id = user.id;
    userEntity.username = user.username.value;
    userEntity.email = user.email;
    userEntity.passwordHash = user.passwordHash;
    userEntity.city = user.city;
    userEntity.dateOfBirth = user.dateOfBirth;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;

    const updatedEntity = await this.userRepository.save(userEntity);
    
    return new User(
      updatedEntity.id,
      new Username(updatedEntity.username),
      updatedEntity.email,
      updatedEntity.passwordHash,
      updatedEntity.city,
      updatedEntity.dateOfBirth,
      updatedEntity.createdAt,
      updatedEntity.updatedAt
    );
  }

  private mapToDomain(entity: UserOrmEntity): User {
    return new User(
      entity.id, 
      new Username(entity.username), 
      entity.email, 
      entity.passwordHash,
      entity.city,
      entity.dateOfBirth,
      entity.createdAt, 
      entity.updatedAt
    );
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) return null;
    return this.mapToDomain(userEntity);
  }

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { username } });
    if (!userEntity) return null;
    return this.mapToDomain(userEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    if (!userEntity) return null;
    return this.mapToDomain(userEntity);
  }

  async findAll(): Promise<User[]> {
    const userEntities = await this.userRepository.find();
    return userEntities.map(entity => this.mapToDomain(entity));
  }
}
