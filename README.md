# fsm-mod-three

---

### Installation

2. **Install dependencies:**
   ```
   npm install
   ```

---

## 🛠️ How to Run & Test

### 1. Running the Demo / "API" Examples

```bash
# Runs examples/demo.ts using npx tsx
npm run demo
```

### 2. Testing the Logic

We use **Jest** for unit and integration testing. Our tests cover the generic FSM engine, the mod-three machine, and utility functions.

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

### 3. Building for Production

To compile the TypeScript source into JavaScript (located in the `dist/` folder):

```bash
npm run build
```

---

## 📖 Usage & Code Examples

### ✨ The `modThree` Helper

This function uses the internal FSM to compute the remainder of a binary string divided by 3.

```typescript
console.log(modThree('1101'));
console.log(modThree('1111'));
```

### 🔧 Creating a Custom FSM

You can use the generic `FiniteAutomaton` class to build any deterministic finite automaton.

```typescript
import { FiniteAutomaton, FAConfig } from 'fsm-mod-three';

type State = 'Green' | 'Yellow' | 'Red';
type Input = 'TIMER';

const config: FAConfig<State, Input> = {
  states: ['Green', 'Yellow', 'Red'],
  alphabet: ['TIMER'],
  initialState: 'Green',
  finalStates: ['Green'],
  transitions: {
    Green: { TIMER: 'Yellow' },
    Yellow: { TIMER: 'Red' },
    Red: { TIMER: 'Green' },
  },
};

const trafficLight = new FiniteAutomaton(config);
trafficLight.transition('TIMER');
```

---
