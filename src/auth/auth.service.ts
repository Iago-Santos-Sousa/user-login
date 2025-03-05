/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { SigInResponseDto } from "./dto/sigInResponse.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async sigIn(email: string, pass: string): Promise<SigInResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException();
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) throw new UnauthorizedException("Invalid credential!");
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
