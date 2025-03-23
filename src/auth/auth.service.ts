/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { SigInResponseDto } from "./dto/signin-response.dto";
import { scrypt as _scrypt } from "crypto";
import { promisify } from "util";
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async sigIn(email: string, pass: string): Promise<SigInResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const [salt, storedHashPassword] = user.password.split(".");
    const hash = (await scrypt(pass, salt, 32)) as Buffer;
    if (storedHashPassword !== hash.toString("hex")) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.user_id,
      username: user.name,
      roles: [user.role],
      email: user.email,
    };
    const acess_token = await this.jwtService.signAsync(payload);

    return {
      acess_token: acess_token,
      refresh_token: user.refresh_token,
      payload,
    };
  }
}
