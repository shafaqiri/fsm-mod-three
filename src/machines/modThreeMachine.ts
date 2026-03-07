import { FiniteAutomaton } from '../fsm/FiniteAutomaton';
import { TransitionMap } from '../fsm/types';
import { validateBinaryString } from '../utils/validateBinary';

type ModThreeState = 'S0' | 'S1' | 'S2';

type BinarySymbol = '0' | '1';

const STATE_TO_REMAINDER: Record<ModThreeState, number> = {
  S0: 0,
  S1: 1,
  S2: 2,
};

const MOD_THREE_TRANSITIONS: TransitionMap<ModThreeState, BinarySymbol> = {
  S0: { '0': 'S0', '1': 'S1' },
  S1: { '0': 'S2', '1': 'S0' },
  S2: { '0': 'S1', '1': 'S2' },
};

export const modThreeMachine = new FiniteAutomaton<ModThreeState, BinarySymbol>({
  states: ['S0', 'S1', 'S2'],
  alphabet: ['0', '1'],
  initialState: 'S0',
  finalStates: ['S0', 'S1', 'S2'],
  transitions: MOD_THREE_TRANSITIONS,
});

export const modThree = (binaryString: string): number => {
  validateBinaryString(binaryString);

  modThreeMachine.reset();

  if (binaryString.length === 0) {
    return 0;
  }

  const symbols = binaryString.split('') as BinarySymbol[];
  const finalState = modThreeMachine.run(symbols);

  return STATE_TO_REMAINDER[finalState];
};
