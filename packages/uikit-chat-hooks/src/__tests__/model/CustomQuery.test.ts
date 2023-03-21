import { CustomQuery } from '../../model/CustomQuery';

describe('CustomQuery', () => {
  const state = { isLoading: false, hasNext: false };
  const customQuery = new CustomQuery({
    next: async () => ['1', '2', '3'],
    isLoading: () => state.isLoading,
    hasNext: () => state.hasNext,
  });

  it('should return an object', () => {
    expect(typeof customQuery).toBe('object');
  });

  it('should have a next function', async () => {
    expect(typeof customQuery.next).toBe('function');
    const result = await customQuery.next();
    expect(result).toEqual(['1', '2', '3']);
  });

  it('should have a isLoading getter', () => {
    expect(typeof customQuery.isLoading).toBe('boolean');
    expect(customQuery.isLoading).toBe(false);
    state.isLoading = true;
    expect(customQuery.isLoading).toBe(true);
  });

  it('should have a hasNext getter', () => {
    expect(typeof customQuery.hasNext).toBe('boolean');
    expect(customQuery.hasNext).toBe(false);
    state.hasNext = true;
    expect(customQuery.hasNext).toBe(true);
  });
});
