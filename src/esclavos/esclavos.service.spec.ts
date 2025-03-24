import { Test, TestingModule } from '@nestjs/testing';
import { EsclavosService } from './esclavos.service';

describe('EsclavosService', () => {
  let service: EsclavosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsclavosService],
    }).compile();

    service = module.get<EsclavosService>(EsclavosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
