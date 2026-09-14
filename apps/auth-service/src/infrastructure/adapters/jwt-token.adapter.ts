import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenProviderPort, TokenPayload } from '../../domain/ports/token-provider.port';

@Injectable()
export class JwtTokenAdapter implements TokenProviderPort {
  private get secret(): string {
    return process.env.JWT_SECRET || 'logipulse_jwt_secret_key_2026';
  }

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '2h' });
  }

  verify(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch {
      return null;
    }
  }
}
