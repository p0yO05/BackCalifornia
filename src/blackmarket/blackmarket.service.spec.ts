import { Test, TestingModule } from '@nestjs/testing';
import { BlackmarketService } from './blackmarket.service';

describe('BlackmarketService', () => {
  let service: BlackmarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlackmarketService],
    }).compile();

    service = module.get<BlackmarketService>(BlackmarketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
