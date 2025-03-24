import { Test, TestingModule } from '@nestjs/testing';
import { BattleService } from './battles.service';

describe('BattlesService', () => {
  let service: BattleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleService],
    }).compile();

    service = module.get<BattleService>(BattleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
