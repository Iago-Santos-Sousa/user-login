import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";

export default registerAs(
  "database",
  (): TypeOrmModuleOptions => ({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    entities: [User],
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    // migrations: [`${__dirname}/migration/{.ts,*.js}`],
    // migrationsRun: true,
  }),
);
