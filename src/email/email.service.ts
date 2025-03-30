import { Injectable, Logger } from "@nestjs/common";
import { MailerService, ISendMailOptions } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "nodemailer";
import * as path from "path";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly emailService: MailerService) {}

  async sendEmail(): Promise<SentMessageInfo> {
    try {
      const options: ISendMailOptions = {
        to: "iago.santos.sousa@gmail.com",
        subject: "testando envio de email",
        template: path.resolve("templates", "reset-password"),
        context: {
          message: "Testando template enviado.",
        },
      };
      const result = this.emailService.sendMail(options);
      this.logger.log("Email enviado com sucesso");
      return result;
    } catch (error) {
      this.logger.error("Falha ao enviar email", error);
      throw error;
    }
  }
}
