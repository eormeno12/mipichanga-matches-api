import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateJWT(userId: string) {
    const access_token = this.jwtService.sign({ sub: userId });
    return access_token;
  }
}
