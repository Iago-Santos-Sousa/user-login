import {
  Controller,
  Post,
  // Body,
  // Param,
} from "@nestjs/common";
import { EmailService } from "./email.service";
import { Public } from "src/common/decorators/skipAuth.decorator";
import { ApiTags } from "@nestjs/swagger";
import { SentMessageInfo } from "nodemailer";

@ApiTags("email")
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post("send-email")
  async sendEmail(): Promise<SentMessageInfo> {
    return await this.emailService.sendEmail();
  }
}
