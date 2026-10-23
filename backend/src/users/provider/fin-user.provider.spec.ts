import { Test, TestingModule } from '@nestjs/testing';
import { FinUserProvider } from './find-user.provider';

describe('FinUserProvider', () => {
  let provider: FinUserProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinUserProvider],
    }).compile();

    provider = module.get<FinUserProvider>(FinUserProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
