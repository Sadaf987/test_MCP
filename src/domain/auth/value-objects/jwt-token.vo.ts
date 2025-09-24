// src/domain/auth/value-objects/jwt-token.vo.ts
export class JwtToken {
  constructor(
    public readonly value: string,
    public readonly expiresAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('JWT token cannot be empty');
    }
    
    if (this.expiresAt <= new Date()) {
      throw new Error('JWT token has expired');
    }
  }

  isExpired(): boolean {
    return this.expiresAt <= new Date();
  }

  static create(token: string, expiresIn: number): JwtToken {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    return new JwtToken(token, expiresAt);
  }
}