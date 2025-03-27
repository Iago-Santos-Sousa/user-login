import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigType } from "@nestjs/config";
import emailConfig from "src/config/email.config";

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      inject: [emailConfig.KEY],
      useFactory: (configService: ConfigType<typeof emailConfig>) => {
        return configService;
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [MailerModule],
})
export class EmailModule {}
