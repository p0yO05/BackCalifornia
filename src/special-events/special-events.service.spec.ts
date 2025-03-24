import { Test, TestingModule } from '@nestjs/testing';
import { SpecialEventsService } from './special-events.service';

describe('SpecialEventsService', () => {
  let service: SpecialEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialEventsService],
    }).compile();

    service = module.get<SpecialEventsService>(SpecialEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
