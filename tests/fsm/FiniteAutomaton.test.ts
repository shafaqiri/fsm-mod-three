import { FiniteAutomaton } from '../../src/fsm/FiniteAutomaton';
import { InvalidSymbolError, InvalidConfigError } from '../../src/fsm/errors';
import { FAConfig } from '../../src/fsm/types';

type TwoState = 'A' | 'B';
type BinSym = '0' | '1';

const toggleConfig: FAConfig<TwoState, BinSym> = {
  states: ['A', 'B'],
  alphabet: ['0', '1'],
  initialState: 'A',
  finalStates: ['B'],
  transitions: {
    A: { '0': 'A', '1': 'B' },
    B: { '0': 'B', '1': 'A' },
  },
};

const makeFSM = (): FiniteAutomaton<TwoState, BinSym> =>
  new FiniteAutomaton<TwoState, BinSym>(toggleConfig);

describe('FiniteAutomaton - construction', () => {
  it('should start in the configured initial state', () => {
    const fsm = makeFSM();
    expect(fsm.currentState).toBe('A');
  });

  it('should throw InvalidConfigError for an invalid config', () => {
    const badConfig = { ...toggleConfig, initialState: 'UNKNOWN' as TwoState };
    expect(() => new FiniteAutomaton(badConfig)).toThrow(InvalidConfigError);
  });
});

describe('FiniteAutomaton - currentState', () => {
  it('should return the initial state before any transitions', () => {
    const fsm = makeFSM();
    expect(fsm.currentState).toBe('A');
  });

  it('should reflect the state after a transition', () => {
    const fsm = makeFSM();
    fsm.transition('1');
    expect(fsm.currentState).toBe('B');
  });
});

describe('FiniteAutomaton - transition()', () => {
  it('should return the next state', () => {
    const fsm = makeFSM();
    expect(fsm.transition('1')).toBe('B');
  });

  it('should stay in same state on symbol "0" from initial state A', () => {
    const fsm = makeFSM();
    expect(fsm.transition('0')).toBe('A');
  });

  it('should follow multiple transitions in sequence', () => {
    const fsm = makeFSM();
    fsm.transition('1');
    fsm.transition('1');
    expect(fsm.currentState).toBe('A');
  });

  it('should throw InvalidSymbolError for a symbol not in the alphabet', () => {
    const fsm = makeFSM();
    expect(() => fsm.transition('2' as BinSym)).toThrow(InvalidSymbolError);
  });

  it('error message should mention the invalid symbol', () => {
    const fsm = makeFSM();
    expect(() => fsm.transition('x' as BinSym)).toThrow(/'x'/);
  });

  it('error message should mention valid alphabet symbols', () => {
    const fsm = makeFSM();
    try {
      fsm.transition('x' as BinSym);
    } catch (e) {
      expect((e as Error).message).toContain("'0'");
      expect((e as Error).message).toContain("'1'");
    }
  });
});

describe('FiniteAutomaton - run()', () => {
  it('should return the final state after processing an input sequence', () => {
    const fsm = makeFSM();
    expect(fsm.run(['1', '0', '1'])).toBe('A');
  });

  it('should return the initial state for an empty input', () => {
    const fsm = makeFSM();
    expect(fsm.run([])).toBe('A');
  });

  it('should process a single-symbol input correctly', () => {
    const fsm = makeFSM();
    expect(fsm.run(['1'])).toBe('B');
  });

  it('should propagate InvalidSymbolError from within the sequence', () => {
    const fsm = makeFSM();
    expect(() => fsm.run(['1', '9' as BinSym])).toThrow(InvalidSymbolError);
  });

  it('should retain state from a previous run (no auto-reset)', () => {
    const fsm = makeFSM();
    fsm.run(['1']);
    const result = fsm.run(['1']);
    expect(result).toBe('A');
  });
});

describe('FiniteAutomaton - reset()', () => {
  it('should restore the FSM to the initial state', () => {
    const fsm = makeFSM();
    fsm.run(['1', '0', '1', '1']);
    fsm.reset();
    expect(fsm.currentState).toBe('A');
  });

  it('should allow a fresh run after reset', () => {
    const fsm = makeFSM();
    fsm.run(['1']);
    fsm.reset();
    expect(fsm.run(['0'])).toBe('A');
  });
});

describe('FiniteAutomaton - isAccepting()', () => {
  it('should return false when current state is not a final state', () => {
    const fsm = makeFSM();
    expect(fsm.isAccepting()).toBe(false);
  });

  it('should return true when current state is a final state', () => {
    const fsm = makeFSM();
    fsm.transition('1');
    expect(fsm.isAccepting()).toBe(true);
  });

  it('should toggle acceptance as state changes', () => {
    const fsm = makeFSM();
    expect(fsm.isAccepting()).toBe(false);
    fsm.transition('1');
    expect(fsm.isAccepting()).toBe(true);
    fsm.transition('1');
    expect(fsm.isAccepting()).toBe(false);
  });

  it('should return false for FSM with no final states', () => {
    const config: FAConfig<TwoState, BinSym> = { ...toggleConfig, finalStates: [] };
    const fsm = new FiniteAutomaton(config);
    fsm.transition('1');
    expect(fsm.isAccepting()).toBe(false);
  });

  it('should return true if all states are accepting', () => {
    const config: FAConfig<TwoState, BinSym> = { ...toggleConfig, finalStates: ['A', 'B'] };
    const fsm = new FiniteAutomaton(config);
    expect(fsm.isAccepting()).toBe(true);
    fsm.transition('1');
    expect(fsm.isAccepting()).toBe(true);
  });
});
