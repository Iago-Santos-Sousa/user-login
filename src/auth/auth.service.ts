/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async sigIn(email: string, pass: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (user?.user?.password !== pass) {
        throw new UnauthorizedException();
      }
      console.log(process.env.JWT_SECRET);
      console.log(process.env.JWT_EXPIRES);
      const payload = {
        sub: user.user.user_id,
        username: user.user.name,
        role: user.user.role,
        email: user.user.email,
      };
      const acess_token = await this.jwtService.signAsync(payload);
      const {
        password,
        created_at,
        updated_at,
        deleted_at,
        refresh_token,
        ...result
      } = user.user;
      return {
        acess_token: acess_token,
        refresh_token: refresh_token,
        payload: { ...result },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
