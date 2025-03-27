import { Injectable } from "@nestjs/common";
import { MailerService, ISendMailOptions } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "nodemailer";

@Injectable()
export class EmailService {
  constructor(private readonly emailService: MailerService) {}

  async sendEmail(): Promise<SentMessageInfo> {
    try {
      const options: ISendMailOptions = {
        to: "iago.santos.sousa@gmail.com",
        subject: "testando envio de email",
        text: "emial enviado",
        html: "<p>Olá</p>",
      };
      const result = this.emailService.sendMail(options);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
