import { Test, TestingModule } from '@nestjs/testing';
import { SpecialEventsController } from './special-events.controller';
import { SpecialEventsService } from './special-events.service';

describe('SpecialEventsController', () => {
  let controller: SpecialEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialEventsController],
      providers: [SpecialEventsService],
    }).compile();

    controller = module.get<SpecialEventsController>(SpecialEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
