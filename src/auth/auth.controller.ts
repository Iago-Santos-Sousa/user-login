import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "./current-user.decorator";
import { CurrentUserDto } from "./current-user.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signin.dto";
import { Public } from "src/common/decorators/skipAuth.decorator";
import { SignInResponseDto } from "./dto/signin-response.dto";
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("login")
  @ApiOperation({ summary: "Login", security: [] })
  @ApiBody({
    description: "Login user",
    type: SignInDto,
  })
  @ApiCreatedResponse({
    description: "User Login Information",
    type: SignInResponseDto,
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.sigIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("refresh-token")
  @ApiOperation({ summary: "Generate new access token for user", security: [] })
  @ApiBody({
    description: "refresh",
    schema: {
      type: "object",
      properties: {
        refresh_token: {
          type: "string",
          example: "your refresh token",
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: SignInResponseDto,
  })
  async refreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.refreshToken(body.refresh_token);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Logout session user",
  })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "User logged out successfully",
        },
      },
    },
  })
  async logout(@CurrentUser() user: CurrentUserDto) {
    return this.authService.logout(user.sub);
  }
}
