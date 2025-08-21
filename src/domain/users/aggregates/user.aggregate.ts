// src/domain/users/aggregates/user.aggregate.ts
import { User } from '../entities/user.entity';
import { Username } from '../value-objects/username.vo';

export class UserAggregate {
  private readonly _user: User;

  constructor(user: User) {
    this._user = user;
  }

  // This method changes the username and returns a new instance of User
  changeUsername(newUsername: string): User {
    const newUsernameVO = new Username(newUsername);  // Create a new Username VO
    // Return a new User object with the new username
    return new User(
      this._user.id,  // Keep the same user ID
      newUsernameVO,  // Update the username
      this._user.email,  // Keep the same email
      this._user.passwordHash,
      this._user.city,
      this._user.dateOfBirth,
      this._user.createdAt,  // Keep the same creation date
      this._user.updatedAt  // Keep the same update date
    );
  }

  // Getter for the user
  get user(): User {
    return this._user;
  }
}
