# fsm-mod-three

A reusable, strongly-typed **Finite State Machine (FSM)** library in TypeScript, with a **mod-three** FA as the reference implementation.

---

## Formal Definition

A Finite Automaton (FA) is a 5-tuple **(Q, Σ, q₀, F, δ)** where:

| Symbol | Meaning                               |
| ------ | ------------------------------------- |
| **Q**  | Finite set of states                  |
| **Σ**  | Finite input alphabet                 |
| **q₀** | Initial state (q₀ ∈ Q)                |
| **F**  | Set of accepting/final states (F ⊆ Q) |
| **δ**  | Transition function δ: Q × Σ → Q      |

For any state `q ∈ Q` and symbol `σ ∈ Σ`, `δ(q, σ)` is the state the FA moves to when it is in state `q` and reads input `σ`.

---

## Mod-Three FA — Specification

The mod-three FA computes the remainder of a binary number divided by 3:

| Component | Value                                   |
| --------- | --------------------------------------- |
| **Q**     | `{ S0, S1, S2 }`                        |
| **Σ**     | `{ '0', '1' }`                          |
| **q₀**    | `S0`                                    |
| **F**     | `{ S0, S1, S2 }` (all states accepting) |

**Transition table δ:**

| State | `'0'` | `'1'` |
| ----- | ----- | ----- |
| `S0`  | `S0`  | `S1`  |
| `S1`  | `S2`  | `S0`  |
| `S2`  | `S1`  | `S2`  |

**State → remainder mapping:** `S0 → 0`, `S1 → 1`, `S2 → 2`

### Worked Example — `"1101"` (= 13 in decimal)

| Step | Symbol | State | Explanation                                              |
| ---- | ------ | ----- | -------------------------------------------------------- |
| Init | —      | `S0`  | q₀ = S0                                                  |
| 1    | `'1'`  | `S1`  | δ(S0, '1') = S1 → value so far: 1                        |
| 2    | `'1'`  | `S0`  | δ(S1, '1') = S0 → value so far: 3                        |
| 3    | `'0'`  | `S0`  | δ(S0, '0') = S0 → value so far: 6                        |
| 4    | `'1'`  | `S1`  | δ(S1, '1') = S0 wait… δ(S0, '1') = S1 → value so far: 13 |

> Final state: `S1` → remainder **1** ✓ (`13 mod 3 = 1`)

---

## Project Structure

```
fsm-mod-three/
├── src/
│   ├── fsm/
│   │   ├── types.ts              # FAConfig, TransitionMap, error classes
│   │   ├── transitionTable.ts    # Config validator (fail-fast)
│   │   └── FiniteAutomaton.ts    # Generic FSM engine
│   ├── machines/
│   │   └── modThreeMachine.ts    # Mod-three FA config + modThree() helper
│   ├── utils/
│   │   └── validateBinary.ts     # Binary string validator
│   └── index.ts                  # Public barrel export
│
├── tests/
│   ├── FiniteAutomaton.test.ts   # Engine unit tests
│   └── modThreeMachine.test.ts   # modThree integration tests
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## Installation

```bash
npm install
```

---

## Usage

### Using the generic FSM engine

```typescript
import { FiniteAutomaton, FAConfig } from 'fsm-mod-three';

type TrafficLight = 'Red' | 'Green' | 'Yellow';
type TimerSignal = 'tick';

const config: FAConfig<TrafficLight, TimerSignal> = {
  states: ['Red', 'Green', 'Yellow'],
  alphabet: ['tick'],
  initialState: 'Red',
  finalStates: ['Red'],
  transitions: {
    Red: { tick: 'Green' },
    Green: { tick: 'Yellow' },
    Yellow: { tick: 'Red' },
  },
};

const light = new FiniteAutomaton(config);

light.transition('tick'); // → 'Green'
light.transition('tick'); // → 'Yellow'
light.transition('tick'); // → 'Red'
light.isAccepting(); // → true
light.reset();
light.currentState; // → 'Red'
```

### Using the mod-three helper

```typescript
import { modThree } from 'fsm-mod-three';

modThree('1101'); // → 1  (13 mod 3 = 1)
modThree('1110'); // → 2  (14 mod 3 = 2)
modThree('1111'); // → 0  (15 mod 3 = 0)
modThree('110'); // → 0  (6  mod 3 = 0)
modThree('1010'); // → 1  (10 mod 3 = 1)
modThree(''); // → 0  (empty = 0, 0 mod 3 = 0)
```

### Error handling

```typescript
import { modThree, InvalidSymbolError, InvalidConfigError } from 'fsm-mod-three';

try {
  modThree('1021'); // '2' is not a binary digit
} catch (err) {
  if (err instanceof TypeError) {
    console.error('Bad input:', err.message);
  }
}
```

---

## API Reference

### `FiniteAutomaton<State, Symbol>`

| Member         | Signature                           | Description                                  |
| -------------- | ----------------------------------- | -------------------------------------------- |
| `constructor`  | `(config: FAConfig<State, Symbol>)` | Creates FA, validates config eagerly         |
| `currentState` | `readonly State`                    | The current state                            |
| `transition`   | `(symbol: Symbol) → State`          | Apply one symbol, return new state           |
| `run`          | `(input: Symbol[]) → State`         | Process full input array, return final state |
| `reset`        | `() → void`                         | Reset to `initialState`                      |
| `isAccepting`  | `() → boolean`                      | `true` if current state ∈ `finalStates`      |

### `modThree(binaryString: string): number`

Computes `parseInt(binaryString, 2) % 3` using the mod-three FA.

- **Input**: string of `'0'` and `'1'` characters; empty string treated as `"0"`
- **Output**: `0`, `1`, or `2`
- **Throws**: `TypeError` if input contains non-binary characters

### Types

```typescript
type TransitionMap<State extends string, Symbol extends string> = Record<
  State,
  Record<Symbol, State>
>;

interface FAConfig<State extends string, Symbol extends string> {
  states: State[];
  alphabet: Symbol[];
  initialState: State;
  finalStates: State[];
  transitions: TransitionMap<State, Symbol>;
}
```

### Error Classes

| Class                    | When thrown                                          |
| ------------------------ | ---------------------------------------------------- |
| `InvalidConfigError`     | FA configuration is incomplete or self-contradictory |
| `InvalidSymbolError`     | Input symbol is not a member of alphabet Σ           |
| `InvalidTransitionError` | No transition defined for `(state, symbol)`          |

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Build the library
npm run build
```

---

## Test Coverage

| File                 | Lines | Branches | Functions |
| -------------------- | ----- | -------- | --------- |
| `FiniteAutomaton.ts` | 100%  | 100%     | 100%      |
| `transitionTable.ts` | 100%  | 100%     | 100%      |
| `modThreeMachine.ts` | 100%  | 100%     | 100%      |
| `validateBinary.ts`  | 100%  | 100%     | 100%      |

---

## Design Decisions

1. **Generics (`State extends string`, `Symbol extends string`)** — give consumers compile-time autocomplete and prevent invalid state/symbol usage at the type level.
2. **Transition table over switch statements** — the `TransitionMap` data structure is declarative, scalable, and trivially testable. Adding a new state is a one-line change.
3. **Fail-fast constructor validation** — misconfiguration is caught at construction time with descriptive errors, not silently at runtime mid-run.
4. **`modThree` resets the shared machine** — the helper calls `reset()` before each invocation, making the function purely stateless from the caller's perspective.
5. **BigInt cross-validation in tests** — large-input tests verify correctness against native `BigInt % 3n`, making the test suite self-proving at scale.
