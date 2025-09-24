export class AuthResponseDTO {
    constructor(
      public readonly accessToken: string,
      public readonly refreshToken: string,
      public readonly expiresIn: number,
      public readonly user: {
        id: number;
        username: string;
        email: string;
      }
    ) {}
  }