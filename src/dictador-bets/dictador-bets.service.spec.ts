import { Test, TestingModule } from '@nestjs/testing';
import { DictadorBetsService } from './dictador-bets.service';

describe('DictadorBetsService', () => {
  let service: DictadorBetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictadorBetsService],
    }).compile();

    service = module.get<DictadorBetsService>(DictadorBetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
