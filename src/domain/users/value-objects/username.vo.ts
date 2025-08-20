export class Username {
    constructor(private readonly _username: string) {
      if (_username.length < 3) throw new Error('Username must be at least 3 characters');
    }
  
    get value(): string {
      return this._username;
    }
  }