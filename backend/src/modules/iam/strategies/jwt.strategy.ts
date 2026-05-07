import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Definisikan bentuk payload secara eksplisit
type JwtPayload = { sub: string; accountId: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>(
        'JWT_SECRET',
        'sotto_super_secret_key_2026',
      ),
    });
  }

  // Hapus kata 'async' karena kita hanya mengembalikan objek biasa (sinkron)
  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      accountId: payload.accountId,
    };
  }
}
