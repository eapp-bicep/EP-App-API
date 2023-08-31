import { PrismaClientExceptionFilter } from './prisma-exception.filter';

describe('PrismaClientExceptionFilter', () => {
  it('should be defined', () => {
    expect(new PrismaClientExceptionFilter()).toBeDefined();
  });
});
