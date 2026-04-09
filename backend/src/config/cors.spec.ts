import { createCorsOriginValidator, getAllowedOrigins } from './cors';

describe('CORS config', () => {
  it('returns default origins when CLIENT_URL is not set', () => {
    const result = getAllowedOrigins(undefined);

    expect(result).toEqual(['http://localhost:5173', 'https://rusvass.github.io']);
  });

  it('parses and trims comma separated origins', () => {
    const result = getAllowedOrigins(' https://calendar-api.example.com , https://api.test.local ');

    expect(result).toEqual([
      'http://localhost:5173',
      'https://rusvass.github.io',
      'https://calendar-api.example.com',
      'https://api.test.local',
    ]);
  });

  it('falls back to default origins when CLIENT_URL has only commas and spaces', () => {
    const result = getAllowedOrigins(' , ,  ');

    expect(result).toEqual(['http://localhost:5173', 'https://rusvass.github.io']);
  });

  it('deduplicates origins when CLIENT_URL repeats default values', () => {
    const result = getAllowedOrigins('http://localhost:5173, https://rusvass.github.io');

    expect(result).toEqual(['http://localhost:5173', 'https://rusvass.github.io']);
  });

  it('allows requests without origin', () => {
    const validator = createCorsOriginValidator(['http://localhost:5173']);
    const callback = jest.fn();

    validator(undefined, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('blocks request from origin that is not in allow list', () => {
    const validator = createCorsOriginValidator(['http://localhost:5173']);
    const callback = jest.fn();

    validator('https://not-allowed.example.com', callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(callback.mock.calls[0][1]).toBeUndefined();
  });
});
