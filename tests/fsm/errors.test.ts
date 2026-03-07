import {
  InvalidSymbolError,
  InvalidTransitionError,
  InvalidConfigError,
} from '../../src/fsm/errors';

describe('InvalidSymbolError', () => {
  it('should be an instance of Error', () => {
    const err = new InvalidSymbolError('x', ['0', '1']);
    expect(err).toBeInstanceOf(Error);
  });

  it('should have name "InvalidSymbolError"', () => {
    const err = new InvalidSymbolError('x', ['0', '1']);
    expect(err.name).toBe('InvalidSymbolError');
  });

  it('should include the invalid symbol in the message', () => {
    const err = new InvalidSymbolError('x', ['0', '1']);
    expect(err.message).toContain("'x'");
  });

  it('should list the allowed alphabet in the message', () => {
    const err = new InvalidSymbolError('x', ['0', '1']);
    expect(err.message).toContain("'0'");
    expect(err.message).toContain("'1'");
  });

  it('should work with an empty alphabet', () => {
    const err = new InvalidSymbolError('a', []);
    expect(err.message).toContain("'a'");
  });
});

describe('InvalidTransitionError', () => {
  it('should be an instance of Error', () => {
    const err = new InvalidTransitionError('S0', '2');
    expect(err).toBeInstanceOf(Error);
  });

  it('should have name "InvalidTransitionError"', () => {
    const err = new InvalidTransitionError('S0', '2');
    expect(err.name).toBe('InvalidTransitionError');
  });

  it('should include the state in the message', () => {
    const err = new InvalidTransitionError('S0', '2');
    expect(err.message).toContain("'S0'");
  });

  it('should include the symbol in the message', () => {
    const err = new InvalidTransitionError('S0', '2');
    expect(err.message).toContain("'2'");
  });
});

describe('InvalidConfigError', () => {
  it('should be an instance of Error', () => {
    const err = new InvalidConfigError('bad config');
    expect(err).toBeInstanceOf(Error);
  });

  it('should have name "InvalidConfigError"', () => {
    const err = new InvalidConfigError('bad config');
    expect(err.name).toBe('InvalidConfigError');
  });

  it('should preserve the supplied message', () => {
    const err = new InvalidConfigError('something went wrong');
    expect(err.message).toBe('something went wrong');
  });
});
