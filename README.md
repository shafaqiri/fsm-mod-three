# fsm-mod-three

A reusable, strongly-typed **Finite State Machine (FSM)** library in TypeScript, with a **mod-three FSM** as the reference example.

---

## Mod-Three FSM

- **States:** S0, S1, S2
- **Alphabet:** '0', '1'
- **Initial state:** S0
- **Final states:** all (S0, S1, S2)

**Transition table δ:**

| State | '0' | '1' |
| ----- | --- | --- |
| S0    | S0  | S1  |
| S1    | S2  | S0  |
| S2    | S1  | S2  |

**State → remainder mapping:**  
S0 → 0, S1 → 1, S2 → 2

**Example:**

```ts
modThree('1101'); // 1 (13 mod 3)
modThree('1110'); // 2 (14 mod 3)
modThree('1111'); // 0 (15 mod 3)
```
