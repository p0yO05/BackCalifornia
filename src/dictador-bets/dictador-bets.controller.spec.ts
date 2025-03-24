import { Test, TestingModule } from '@nestjs/testing';
import { BetController } from './dictador-bets.controller';
import { BetService } from './dictador-bets.service';

describe('DictadorBetsController', () => {
  let controller: BetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetController],
      providers: [BetService],
    }).compile();

    controller = module.get<BetController>(BetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
