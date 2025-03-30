import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  // Body,
  // Param,
} from "@nestjs/common";
import { EmailService } from "./email.service";
import { Public } from "src/common/decorators/skipAuth.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
// import { SentMessageInfo } from "nodemailer";

@ApiTags("email")
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post("send-email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "send E-mail",
    security: [],
  })
  sendEmail(): { message: string } {
    this.emailService
      .sendEmail()
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Erro ao enviar email: ", error);
      });

    return { message: "E-mail sent" };
  }
}
