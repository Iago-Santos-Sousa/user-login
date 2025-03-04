import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix("/api"); // Definir o prefixo global '/api'
  await app.listen(process.env.APP_PORT ?? 3001);
}
bootstrap()
  .then(() =>
    console.log(`Server running on port: ${process.env.APP_PORT ?? 3001}`),
  )
  .catch((err) => console.error(err));
