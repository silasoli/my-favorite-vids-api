import { Test, TestingModule } from '@nestjs/testing';
import { AdminVideosService } from '../services/admin-videos.service';
import { AdminVideosController } from './admin-videos.controller';

describe('VideosController', () => {
  let controller: AdminVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminVideosController],
      providers: [AdminVideosService],
    }).compile();

    controller = module.get<AdminVideosController>(AdminVideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
