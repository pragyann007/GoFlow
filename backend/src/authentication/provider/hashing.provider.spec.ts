import { Test, TestingModule } from '@nestjs/testing';
import { HashingProvider } from './hashing.provider';

describe('HashingProvider', () => {
  let provider: HashingProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingProvider],
    }).compile();

    provider = module.get<HashingProvider>(HashingProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
