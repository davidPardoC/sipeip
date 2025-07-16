export interface TokenPayload {
  name: string;
  email: string;
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
  jti: string;
  realm_access: {
    roles: string[];
  }
}
