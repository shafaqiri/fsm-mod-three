export type TransitionMap<State extends string, InputSymbol extends string> = Record<
  State,
  Record<InputSymbol, State>
>;

export interface FAConfig<State extends string, InputSymbol extends string> {
  states: State[];
  alphabet: InputSymbol[];
  initialState: State;
  finalStates: State[];
  transitions: TransitionMap<State, InputSymbol>;
}
