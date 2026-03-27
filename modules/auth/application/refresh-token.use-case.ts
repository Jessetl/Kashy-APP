import type { AuthTokens } from '../domain/auth.entity';
import type { AuthPort } from '../domain/auth.port';

export class RefreshTokenUseCase {
  constructor(private readonly authPort: AuthPort) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken.trim()) {
      throw new Error('No hay refresh token disponible');
    }
    return this.authPort.refreshToken(refreshToken);
  }
}
