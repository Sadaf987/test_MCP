// src/application/users/handlers/get-all-users.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllUsersQuery } from '../queries/get-all-users.query';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(query: GetAllUsersQuery) {
    return await this.userRepository.findAll();
  }
}
