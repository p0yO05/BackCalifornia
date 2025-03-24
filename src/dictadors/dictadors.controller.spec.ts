import { Test, TestingModule } from '@nestjs/testing';
import { DictadorsController } from './dictadors.controller';
import { DictadorsService } from './dictadors.service';

describe('DictadorsController', () => {
  let controller: DictadorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictadorsController],
      providers: [DictadorsService],
    }).compile();

    controller = module.get<DictadorsController>(DictadorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
