import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 2000);
    console.log(`Token expiration: ${decoded.exp}, Current time: ${currentTime}, Expired: ${decoded.exp < currentTime}`);
    return decoded.exp < currentTime;
  } catch (e) {
    console.error('Error decoding token:', e);
    return true;
  }
}