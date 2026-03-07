export const validateBinaryString = (input: string): void => {
  if (!/^[01]*$/.test(input)) {
    throw new TypeError(
      `Invalid binary string: '${input}'. ` + `Only characters '0' and '1' are allowed.`,
    );
  }
};
