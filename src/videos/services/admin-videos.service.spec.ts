import { Test, TestingModule } from '@nestjs/testing';
import { AdminVideosService } from './admin-videos.service';

describe('VideosService', () => {
  let service: AdminVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminVideosService],
    }).compile();

    service = module.get<AdminVideosService>(AdminVideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
