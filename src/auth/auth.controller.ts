import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiBody,
  ApiTags,
  ApiOperation,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SigInDto } from "./dto/signin.dto";
import { Public } from "src/common/decorators/skipAuth.decorator";
import { SigInResponseDto } from "./dto/signin-response.dto";
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("login")
  @ApiOperation({ summary: "Login" })
  @ApiBody({
    description: "Login user",
    type: SigInDto,
  })
  @ApiCreatedResponse({
    description: "User Login Information",
    type: SigInResponseDto,
  })
  async signIn(@Body() sigInDto: SigInDto) {
    return this.authService.sigIn(sigInDto.email, sigInDto.password);
  }
}
