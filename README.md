### Example: Simple Traffic Light FSM

This is a minimal example of a custom FSM configuration.

```ts
import { FiniteAutomaton, FAConfig } from 'fsm-mod-three';

type LightState = 'Red' | 'Green' | 'Yellow';
type Signal = 'timer';

const trafficLightConfig: FAConfig<LightState, Signal> = {
  states: ['Red', 'Green', 'Yellow'],
  alphabet: ['timer'],
  initialState: 'Red',
  finalStates: ['Red'], // optional: states considered "accepting"
  transitions: {
    Red: { timer: 'Green' },
    Green: { timer: 'Yellow' },
    Yellow: { timer: 'Red' },
  },
};

const trafficLightFSM = new FiniteAutomaton(trafficLightConfig);
```
