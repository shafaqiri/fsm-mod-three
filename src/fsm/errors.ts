export class InvalidSymbolError extends Error {
  constructor(symbol: string, alphabet: string[]) {
    super(
      `Invalid symbol '${symbol}'. Expected one of: [${alphabet.map((s) => `'${s}'`).join(', ')}]`,
    );
    this.name = 'InvalidSymbolError';
  }
}

export class InvalidTransitionError extends Error {
  constructor(state: string, symbol: string) {
    super(
      `No transition defined for state '${state}' on symbol '${symbol}'. ` +
        `Check your transition table for completeness.`,
    );
    this.name = 'InvalidTransitionError';
  }
}

export class InvalidConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidConfigError';
  }
}
