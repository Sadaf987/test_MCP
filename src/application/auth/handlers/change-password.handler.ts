import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ChangePasswordCommand } from '../commands/change-password.command';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';
import { InvalidCredentialsException } from 'src/common/exceptions/user.exceptions';
import * as bcrypt from 'bcrypt';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: ChangePasswordCommand): Promise<{ message: string }> {
    const { userId, currentPassword, newPassword } = command;

    // Find user by ID
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatedUser = new (user.constructor as any)(
      user.id,
      user.username,
      user.email,
      newPasswordHash,
      user.city,
      user.dateOfBirth,
      user.createdAt,
      new Date() // updatedAt
    );

    await this.userRepository.update(updatedUser);

    return {
      message: 'Password changed successfully'
    };
  }
}
