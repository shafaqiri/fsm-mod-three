import { FiniteAutomaton, modThree, FAConfig } from '../src/index';

/**
 * Example 1: Using the modThree helper
 */
console.log('Example 1: modThree helper');
const inputs = ['1101', '1111', '1010', '0', '1'];

inputs.forEach((input) => {
  const result = modThree(input);
  const decimal = parseInt(input, 2);
  console.log(
    `Binary: ${input.padStart(5, ' ')} (Dec: ${decimal.toString().padStart(2, ' ')}) | Remainder: ${result}`,
  );
});

/**
 * Example 2: Creating a custom generic Finite Automaton
 */
console.log('\nExample 2: Custom Generic FSM');

type State = 'EVEN_B' | 'ODD_B';
type Alphabet = 'a' | 'b';

const evenBConfig: FAConfig<State, Alphabet> = {
  states: ['EVEN_B', 'ODD_B'],
  alphabet: ['a', 'b'],
  initialState: 'EVEN_B',
  finalStates: ['EVEN_B'],
  transitions: {
    EVEN_B: { a: 'EVEN_B', b: 'ODD_B' },
    ODD_B: { a: 'ODD_B', b: 'EVEN_B' },
  },
};

const evenBFSM = new FiniteAutomaton<State, Alphabet>(evenBConfig);

const testStrings = ['aba', 'abba', 'abbba', ''];

testStrings.forEach((str) => {
  evenBFSM.reset();
  const inputSymbols = str.split('') as Alphabet[];
  evenBFSM.run(inputSymbols);
  const isAccepted = evenBFSM.isAccepting();

  console.log(
    `String: "${str.padStart(5, ' ')}" | Even 'b's? ${isAccepted ? 'YES (Accepted)' : 'NO'}`,
  );
});
