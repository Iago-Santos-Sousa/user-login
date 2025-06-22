import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from "@nestjs/swagger";

async function bootstrap() {
  // Create the HTTP app for Swagger and REST endpoints
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix("/api");

  const config = new DocumentBuilder()
    .setTitle("Users example")
    .setDescription("The users API description")
    .setVersion("1.0")
    .addTag("Users")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      in: "header",
      name: "Authorization",
    })
    .addSecurityRequirements("bearer")
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup("api", app, document);

  // Start the HTTP server
  await app.listen(process.env.APP_PORT ?? 3001);

  // Conectando ao RabbitMQ para consumir mensagens(subscriber)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${"user"}:${"password"}@${"localhost"}:${"5672"}`],
      queue: "ex",
      queueOptions: {
        durable: true,
      },
      noAck: false, // Garantir que as mensagens sejam reconhecidas(Reconhecimento de mensagem)
      maxConnectionAttempts: 5, // Tentar reconectar 5 vezes
    },
  });

  await app.startAllMicroservices();
}

bootstrap()
  .then(() =>
    console.log(`Server running on port: ${process.env.APP_PORT ?? 3001}`),
  )
  .catch((err) => console.error(err));
