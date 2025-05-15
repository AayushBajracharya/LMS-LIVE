export interface User {
    userId: number;
    username: string;
    password: string;
    email: string;
    role: string;
  }
  
  export interface LoginDTO {
    username: string;
    password: string;
  }
  
  export interface Tokens {
    accessToken: string;
    refreshToken: string;
    userId: number;
  }

