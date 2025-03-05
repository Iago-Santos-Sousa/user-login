import { Controller } from '@nestjs/common';
import { RolesGuardService } from './roles-guard.service';

@Controller('roles-guard')
export class RolesGuardController {
  constructor(private readonly rolesGuardService: RolesGuardService) {}
}
