import { Test, TestingModule } from '@nestjs/testing';
import { DiscoverController } from './user-discover.controller';
import { DiscoverService } from '../services/user-discover.service';

describe('DiscoverController', () => {
  let controller: DiscoverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscoverController],
      providers: [DiscoverService],
    }).compile();

    controller = module.get<DiscoverController>(DiscoverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
