import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SigInDto } from "./dto/SigInDto.dto";
import { Public } from "src/common/decorators/skipAuth.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() sigInDto: SigInDto) {
    return this.authService.sigIn(sigInDto.email, sigInDto.password);
  }
}
