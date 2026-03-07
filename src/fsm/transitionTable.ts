import { InvalidConfigError } from './errors';
import { FAConfig } from './types';

export const validateConfig = <State extends string, InputSymbol extends string>(
  config: FAConfig<State, InputSymbol>,
): void => {
  const { states, alphabet, initialState, finalStates, transitions } = config;

  const stateSet = new Set<string>(states);
  const alphabetSet = new Set<string>(alphabet);

  // 1. Validate initialState ∈ Q
  if (!stateSet.has(initialState)) {
    throw new InvalidConfigError(
      `initialState '${initialState}' is not a member of states [${states.join(', ')}].`,
    );
  }

  // 2. Validate F ⊆ Q
  for (const finalState of finalStates) {
    if (!stateSet.has(finalState)) {
      throw new InvalidConfigError(
        `Final state '${finalState}' is not a member of states [${states.join(', ')}].`,
      );
    }
  }

  // 3. Validate transition table completeness: every (state, symbol) pair must be defined
  for (const state of states) {
    const stateTransitions = transitions[state];

    if (stateTransitions === undefined || stateTransitions === null) {
      throw new InvalidConfigError(`Transition table is missing an entry for state '${state}'.`);
    }

    for (const symbol of alphabet) {
      const nextState = stateTransitions[symbol];

      if (nextState === undefined || nextState === null) {
        throw new InvalidConfigError(
          `Transition table is missing transition for state '${state}' on symbol '${symbol}'.`,
        );
      }

      // 4. Validate that all target states are members of Q
      if (!stateSet.has(nextState)) {
        throw new InvalidConfigError(
          `Transition δ('${state}', '${symbol}') = '${nextState}' references an unknown state. ` +
            `Valid states are: [${states.join(', ')}].`,
        );
      }
    }

    // 5. Check for entries in the transition row that reference unknown symbols
    const definedSymbols = Object.keys(stateTransitions);
    for (const sym of definedSymbols) {
      if (!alphabetSet.has(sym)) {
        throw new InvalidConfigError(
          `Transition table for state '${state}' contains an entry for symbol '${sym}', ` +
            `which is not in the alphabet [${alphabet.join(', ')}].`,
        );
      }
    }
  }
};
