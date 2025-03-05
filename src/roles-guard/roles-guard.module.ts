import { Module } from "@nestjs/common";
import { RolesGuardService } from "./roles-guard.service";
import { RolesGuardController } from "./roles-guard.controller";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";

@Module({
  controllers: [RolesGuardController],
  providers: [
    RolesGuardService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
})
export class RolesGuardModule {}
