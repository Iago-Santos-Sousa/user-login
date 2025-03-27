import { registerAs } from "@nestjs/config";
import { MailerOptions } from "@nestjs-modules/mailer";

export default registerAs(
  "email",
  (): MailerOptions => ({
    transport: {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    },

    defaults: {
      from: process.env.EMAIL_FROM,
    },
  }),
);
