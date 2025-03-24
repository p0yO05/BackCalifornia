import { Test, TestingModule } from '@nestjs/testing';
import { BlackMarketController } from './blackmarket.controller';
import { BlackmarketService } from './blackmarket.service';

describe('BlackmarketController', () => {
  let controller: BlackMarketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlackMarketController],
      providers: [BlackmarketService],
    }).compile();

    controller = module.get<BlackMarketController>(BlackMarketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
