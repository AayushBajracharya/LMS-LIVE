import { Tokens } from "../../types/model";


export class TokenService {
  static getTokens(): Tokens | null {
    const tokens = localStorage.getItem('tokens');
    return tokens ? JSON.parse(tokens) : null;
  }

  static getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  }

  static getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refreshToken || null;
  }

  static setTokens(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  static clearTokens() {
    localStorage.removeItem('tokens');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
  }
}