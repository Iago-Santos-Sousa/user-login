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
    description: "The record has been successfully created.",
    example: {
      acess_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoiSm9yZ2U4Iiwicm9sZXMiOlsiYWRtaW4iXSwiZW1haWwiOiJqb3JnZThAZ21haWwuY29tIiwiaWF0IjoxNzQxNTYxOTY5LCJleHAiOjE3NDE1NjU1Njl9.-o74-HxyLB1BOQ-c7UDCPW9mc_2GIrfMjXzbIczWMqk",
      refresh_token: "NULL",
      payload: {
        sub: 1,
        username: "Jhon Doe",
        roles: ["admin"],
        email: "jhondoe@gmail.com",
      },
    },
  })
  async signIn(@Body() sigInDto: SigInDto) {
    return this.authService.sigIn(sigInDto.email, sigInDto.password);
  }
}
