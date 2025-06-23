import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { AddressModule } from "./address/address.module";
import databaseConfig from "./config/database.config";
import emailConfig from "./config/email.config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { redisStore } from "cache-manager-redis-yet";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    // Configuração do módulo de configuração global. Carrega as variáveis de ambiente do arquivo .env e as configurações do banco
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [databaseConfig, emailConfig],
    }),

    // Configuração do TypeORM para conexão com o banco de dados
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const configOptions =
          configService.get<TypeOrmModuleOptions>("database");
        if (!configOptions) {
          throw new Error("Database configuration not found");
        }
        return configOptions;
      },
    }),

    // Configuração ao RabbitMQ como cliente(publisher)
    ClientsModule.registerAsync([
      {
        name: "RABBITMQ_CLIENT",
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>("RABBITMQ_URL") ||
                `amqp://${"user"}:${"password"}@${"localhost"}:${"5672"}`,
            ],
            queue: "ex",
            queueOptions: {
              durable: true,
            },
            noAck: false, // Garantir que as mensagens sejam reconhecidas(Reconhecimento de mensagem)
          },
        }),
        inject: [ConfigService],
      },
    ]),

    // Configuração do Redis
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host:
              configService.get<string>("REDIS_HOST", "localhost") ||
              "localhost",
            port: configService.get<number>("REDIS_PORT", 6379) || 6379,
          },
          password: configService.get<string>("REDIS_PASSWORD", "") || "",
          ttl: 60 * 60, // Tempo padrão de expiração: 1 hora
        }),
      }),
    }),
    AuthModule,
    UserModule,
    EmailModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // Injeta o DataSource para configurar o middleware. Isso é necessário para que o middleware tenha acesso ao banco de dados, se necessário
  constructor(private dataSource: DataSource) {}

  // Configura o middleware globalmente. O LoggerMiddleware será aplicado a todas as rotas do aplicativo
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/");
  }
}
