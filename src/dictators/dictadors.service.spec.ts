import { Test, TestingModule } from '@nestjs/testing';
import { DictadorsService } from './dictadors.service';

describe('DictadorsService', () => {
  let service: DictadorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictadorsService],
    }).compile();

    service = module.get<DictadorsService>(DictadorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
