import { Test, TestingModule } from '@nestjs/testing';
import { UrlTaskService } from './url-task.service';

describe('UrlTaskService', () => {
  let service: UrlTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlTaskService],
    }).compile();

    service = module.get<UrlTaskService>(UrlTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
