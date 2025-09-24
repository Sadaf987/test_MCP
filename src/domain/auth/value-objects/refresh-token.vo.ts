export class RefreshToken {
    constructor(
      public readonly value: string,
      public readonly userId: number,
      public readonly expiresAt: Date
    ) {
      this.validate();
    }
  
    private validate(): void {
      if (!this.value || this.value.trim().length === 0) {
        throw new Error('Refresh token cannot be empty');
      }
      
      if (this.userId <= 0) {
        throw new Error('Invalid user ID');
      }
    }
  
    isExpired(): boolean {
      return this.expiresAt <= new Date();
    }
  }