import { Test, TestingModule } from '@nestjs/testing';
import { SponsorController } from './sponsors.controller';
import { SponsorService } from './sponsors.service';

describe('SponsorsController', () => {
  let controller: SponsorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SponsorController],
      providers: [SponsorService],
    }).compile();

    controller = module.get<SponsorController>(SponsorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
