import { Test, TestingModule } from '@nestjs/testing';
import { BetService } from './dictador-bets.service';

describe('DictadorBetsService', () => {
  let service: BetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetService],
    }).compile();

    service = module.get<BetService>(BetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
