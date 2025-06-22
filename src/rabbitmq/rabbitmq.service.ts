/* eslint-disable @typescript-eslint/require-await */
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { timeout } from "rxjs/operators";
// import { EmailMessage } from "./interfaces/email-message.interface";

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject("RABBITMQ_CLIENT") private readonly client: ClientProxy,
  ) {}

  async sendEmailMessage(message: string): Promise<void> {
    // this.client.emit<any>("message", message).pipe(timeout(5000))
    this.client
      .emit<any>("message", message)
      .pipe(timeout(5000))
      .subscribe({
        next: (response) => {
          console.log("Message sent to RabbitMQ:", response);
        },
        error: (err) => {
          console.error("Error sending message RabbitMQ:", err);
        },
        complete() {
          console.log("Message sent successfully to RabbitMQ");
        },
      });
  }
}
