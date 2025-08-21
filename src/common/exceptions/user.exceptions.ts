// src/common/exceptions/user.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super({
      message: 'Email already exists',
      statusCode: 400,
      error: 'Bad Request'
    }, HttpStatus.BAD_REQUEST);
  }
}

export class UsernameAlreadyExistsException extends HttpException {
  constructor() {
    super({
      message: 'Username already exists',
      statusCode: 400,
      error: 'Bad Request'
    }, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super({
      message: 'Invalid email or password',
      statusCode: 401,
      error: 'Unauthorized'
    }, HttpStatus.UNAUTHORIZED);
  }
} 