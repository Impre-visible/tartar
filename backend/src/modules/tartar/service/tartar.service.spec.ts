import { Test, TestingModule } from '@nestjs/testing';
import { TartarService } from './tartar.service';

describe('TartarService', () => {
  let service: TartarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TartarService],
    }).compile();

    service = module.get<TartarService>(TartarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
