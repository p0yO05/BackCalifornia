import { Test, TestingModule } from '@nestjs/testing';
import { EsclavosController } from './esclavos.controller';
import { EsclavosService } from './esclavos.service';

describe('EsclavosController', () => {
  let controller: EsclavosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EsclavosController],
      providers: [EsclavosService],
    }).compile();

    controller = module.get<EsclavosController>(EsclavosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
