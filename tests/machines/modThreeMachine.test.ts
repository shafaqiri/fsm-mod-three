import { modThree, modThreeMachine } from '../../src/machines/modThreeMachine';

describe('modThree()', () => {
  describe('mathematical correctness', () => {
    const cases: [string, number][] = [
      ['0', 0], // 0 % 3 = 0
      ['1', 1], // 1 % 3 = 1
      ['10', 2], // 2 % 3 = 2
      ['11', 0], // 3 % 3 = 0
      ['100', 1], // 4 % 3 = 1
      ['101', 2], // 5 % 3 = 2
    ];

    test.each(cases)('modThree("%s") === %i', (input, expected) => {
      expect(modThree(input)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for an empty string', () => {
      expect(modThree('')).toBe(0);
    });

    it('should return 0 for "0"', () => {
      expect(modThree('0')).toBe(0);
    });

    it('should return 0 for a long all-zero string', () => {
      expect(modThree('000000')).toBe(0);
    });

    it('should handle a very long binary number', () => {
      // 2^20 = 1048576; 1048576 % 3 = 1
      const big = '1' + '0'.repeat(20);
      expect(modThree(big)).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should throw TypeError for a non-binary string', () => {
      expect(() => modThree('2')).toThrow(TypeError);
    });

    it('should throw TypeError for a string with spaces', () => {
      expect(() => modThree('1 0')).toThrow(TypeError);
    });

    it('should throw TypeError for alphabetic input', () => {
      expect(() => modThree('abc')).toThrow(TypeError);
    });

    it('should throw TypeError for a mixed valid/invalid string', () => {
      expect(() => modThree('101x')).toThrow(TypeError);
    });
  });

  describe('idempotency', () => {
    it('should give consistent results across multiple calls with the same input', () => {
      expect(modThree('1101')).toBe(1);
      expect(modThree('1101')).toBe(1);
      expect(modThree('1101')).toBe(1);
    });

    it('should not be affected by the state from a previous call', () => {
      modThree('111'); // 7 % 3 = 1 → ends in S1
      expect(modThree('110')).toBe(0); // 6 % 3 = 0, must reset properly
    });
  });
});

// ── modThreeMachine (singleton) ───────────────────────────────────────────────

describe('modThreeMachine singleton', () => {
  beforeEach(() => {
    modThreeMachine.reset();
  });

  it('should start in state S0', () => {
    expect(modThreeMachine.currentState).toBe('S0');
  });

  it('should transition S0 --"0"--> S0', () => {
    expect(modThreeMachine.transition('0')).toBe('S0');
  });

  it('should transition S0 --"1"--> S1', () => {
    expect(modThreeMachine.transition('1')).toBe('S1');
  });

  it('should transition S1 --"0"--> S2', () => {
    modThreeMachine.transition('1'); // S0 → S1
    expect(modThreeMachine.transition('0')).toBe('S2');
  });

  it('should transition S1 --"1"--> S0', () => {
    modThreeMachine.transition('1'); // S0 → S1
    expect(modThreeMachine.transition('1')).toBe('S0');
  });

  it('should transition S2 --"0"--> S1', () => {
    modThreeMachine.transition('1'); // S0 → S1
    modThreeMachine.transition('0'); // S1 → S2
    expect(modThreeMachine.transition('0')).toBe('S1');
  });

  it('should transition S2 --"1"--> S2', () => {
    modThreeMachine.transition('1'); // S0 → S1
    modThreeMachine.transition('0'); // S1 → S2
    expect(modThreeMachine.transition('1')).toBe('S2');
  });

  it('should reset back to S0', () => {
    modThreeMachine.run(['1', '1', '0']);
    modThreeMachine.reset();
    expect(modThreeMachine.currentState).toBe('S0');
  });

  it('should be accepting in all states (all states are final)', () => {
    expect(modThreeMachine.isAccepting()).toBe(true); // S0
    modThreeMachine.transition('1');
    expect(modThreeMachine.isAccepting()).toBe(true); // S1
    modThreeMachine.transition('0');
    expect(modThreeMachine.isAccepting()).toBe(true); // S2
  });
});
