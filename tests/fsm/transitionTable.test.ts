import { validateConfig } from '../../src/fsm/transitionTable';
import { InvalidConfigError } from '../../src/fsm/errors';
import { FAConfig } from '../../src/fsm/types';

// A minimal valid two-state, two-symbol FSM for reuse across tests
type TwoState = 'A' | 'B';
type BinSym = '0' | '1';

const validConfig: FAConfig<TwoState, BinSym> = {
  states: ['A', 'B'],
  alphabet: ['0', '1'],
  initialState: 'A',
  finalStates: ['B'],
  transitions: {
    A: { '0': 'A', '1': 'B' },
    B: { '0': 'A', '1': 'B' },
  },
};

describe('validateConfig', () => {
  describe('valid configuration', () => {
    it('should not throw for a fully valid config', () => {
      expect(() => validateConfig(validConfig)).not.toThrow();
    });

    it('should not throw when finalStates is empty', () => {
      const config: FAConfig<TwoState, BinSym> = { ...validConfig, finalStates: [] };
      expect(() => validateConfig(config)).not.toThrow();
    });

    it('should not throw when initialState equals the only state', () => {
      type S = 'X';
      type Sym = 'a';
      const config: FAConfig<S, Sym> = {
        states: ['X'],
        alphabet: ['a'],
        initialState: 'X',
        finalStates: ['X'],
        transitions: { X: { a: 'X' } },
      };
      expect(() => validateConfig(config)).not.toThrow();
    });
  });

  describe('invalid initialState', () => {
    it('should throw InvalidConfigError when initialState is not in states', () => {
      const badConfig = { ...validConfig, initialState: 'Z' as TwoState };
      expect(() => validateConfig(badConfig)).toThrow(InvalidConfigError);
    });

    it('error message should mention the invalid initialState', () => {
      const badConfig = { ...validConfig, initialState: 'Z' as TwoState };
      expect(() => validateConfig(badConfig)).toThrow(/initialState 'Z'/);
    });
  });

  describe('invalid finalStates', () => {
    it('should throw InvalidConfigError when a final state is not in states', () => {
      const badConfig = { ...validConfig, finalStates: ['C' as TwoState] };
      expect(() => validateConfig(badConfig)).toThrow(InvalidConfigError);
    });

    it('error message should mention the offending final state', () => {
      const badConfig = { ...validConfig, finalStates: ['C' as TwoState] };
      expect(() => validateConfig(badConfig)).toThrow(/Final state 'C'/);
    });
  });

  describe('incomplete transition table - missing state row', () => {
    it('should throw when a state has no transition row', () => {
      const transitions = { A: { '0': 'A', '1': 'B' } } as unknown as FAConfig<
        TwoState,
        BinSym
      >['transitions'];
      const badConfig: FAConfig<TwoState, BinSym> = { ...validConfig, transitions };
      expect(() => validateConfig(badConfig)).toThrow(InvalidConfigError);
    });

    it('error message should mention the missing state', () => {
      const transitions = { A: { '0': 'A', '1': 'B' } } as unknown as FAConfig<
        TwoState,
        BinSym
      >['transitions'];
      const badConfig: FAConfig<TwoState, BinSym> = { ...validConfig, transitions };
      expect(() => validateConfig(badConfig)).toThrow(/missing an entry for state 'B'/);
    });
  });

  describe('incomplete transition table - missing symbol', () => {
    it('should throw when a (state, symbol) pair is missing', () => {
      const transitions = {
        A: { '0': 'A', '1': 'B' },
        B: { '0': 'A' },
      } as unknown as FAConfig<TwoState, BinSym>['transitions'];
      const badConfig: FAConfig<TwoState, BinSym> = { ...validConfig, transitions };
      expect(() => validateConfig(badConfig)).toThrow(InvalidConfigError);
    });

    it('error message should mention the missing state and symbol', () => {
      const transitions = {
        A: { '0': 'A', '1': 'B' },
        B: { '0': 'A' },
      } as unknown as FAConfig<TwoState, BinSym>['transitions'];
      const badConfig: FAConfig<TwoState, BinSym> = { ...validConfig, transitions };
      expect(() => validateConfig(badConfig)).toThrow(
        /state 'B'.*symbol '1'|symbol '1'.*state 'B'/,
      );
    });
  });

  describe('transition targets an unknown state', () => {
    it('should throw when a transition points to a state not in states', () => {
      const transitions = {
        A: { '0': 'A', '1': 'Z' },
        B: { '0': 'A', '1': 'B' },
      } as unknown as FAConfig<TwoState, BinSym>['transitions'];
      const badConfig: FAConfig<TwoState, BinSym> = { ...validConfig, transitions };
      expect(() => validateConfig(badConfig)).toThrow(InvalidConfigError);
    });

    it('error message should mention the unknown target state', () => {
      const transitions = {
        A: { '0': 'A', '1': 'Z' },
        B: { '0': 'A', '1': 'B' },
      } as unknown as FAConfig<TwoState, BinSym>['transitions'];
      const badConfig: FAConfig<TwoState, BinSym> = { ...validConfig, transitions };
      expect(() => validateConfig(badConfig)).toThrow(/'Z'/);
    });
  });

  describe('transition table contains an extra unknown symbol', () => {
    it('should throw when a transition row has a key outside the alphabet', () => {
      const transitions = {
        A: { '0': 'A', '1': 'B', '9': 'A' },
        B: { '0': 'A', '1': 'B' },
      } as unknown as FAConfig<TwoState, BinSym>['transitions'];
      const badConfig: FAConfig<TwoState, BinSym> = { ...validConfig, transitions };
      expect(() => validateConfig(badConfig)).toThrow(InvalidConfigError);
    });

    it('error message should mention the unknown symbol', () => {
      const transitions = {
        A: { '0': 'A', '1': 'B', '9': 'A' },
        B: { '0': 'A', '1': 'B' },
      } as unknown as FAConfig<TwoState, BinSym>['transitions'];
      const badConfig: FAConfig<TwoState, BinSym> = { ...validConfig, transitions };
      expect(() => validateConfig(badConfig)).toThrow(/'9'/);
    });
  });
});
