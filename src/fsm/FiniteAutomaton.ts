import { FAConfig } from './types';
import { validateConfig } from './validateConfig';
import { InvalidSymbolError, InvalidTransitionError } from './errors';

export class FiniteAutomaton<State extends string, InputSymbol extends string> {
  private readonly config: FAConfig<State, InputSymbol>;
  private _currentState: State;

  constructor(config: FAConfig<State, InputSymbol>) {
    validateConfig(config);
    this.config = config;
    this._currentState = config.initialState;
  }

  get currentState(): State {
    return this._currentState;
  }

  transition(symbol: InputSymbol): State {
    if (!(this.config.alphabet as string[]).includes(symbol)) {
      throw new InvalidSymbolError(symbol, this.config.alphabet);
    }

    const nextState = this.config.transitions[this._currentState][symbol];

    if (nextState === undefined) {
      throw new InvalidTransitionError(this._currentState, symbol);
    }

    this._currentState = nextState;
    return this._currentState;
  }

  run(input: InputSymbol[]): State {
    for (const symbol of input) {
      this.transition(symbol);
    }
    return this._currentState;
  }

  reset(): void {
    this._currentState = this.config.initialState;
  }

  isAccepting(): boolean {
    return (this.config.finalStates as string[]).includes(this._currentState);
  }
}
