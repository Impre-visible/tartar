import { Test, TestingModule } from '@nestjs/testing';
import { TartarController } from './tartar.controller';

describe('TartarController', () => {
  let controller: TartarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TartarController],
    }).compile();

    controller = module.get<TartarController>(TartarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
