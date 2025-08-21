// src/domain/users/entities/user.entity.ts
import { Username } from '../value-objects/username.vo';

export class User {
  constructor(
    public readonly id: number,
    public readonly username: Username,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly city: string,
    public readonly dateOfBirth: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
