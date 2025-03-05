import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuardController } from './roles-guard.controller';
import { RolesGuardService } from './roles-guard.service';

describe('RolesGuardController', () => {
  let controller: RolesGuardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesGuardController],
      providers: [RolesGuardService],
    }).compile();

    controller = module.get<RolesGuardController>(RolesGuardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
