export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DISPATCHER' | 'DRIVER';
}

export interface TokenProviderPort {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload | null;
}

export const TOKEN_PROVIDER_PORT = Symbol('TOKEN_PROVIDER_PORT');
