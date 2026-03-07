import { validateBinaryString } from '../../src/utils/validateBinary';

describe('validateBinaryString', () => {
  describe('valid inputs', () => {
    it('should not throw for an empty string', () => {
      expect(() => validateBinaryString('')).not.toThrow();
    });

    it('should not throw for a single "0"', () => {
      expect(() => validateBinaryString('0')).not.toThrow();
    });

    it('should not throw for a single "1"', () => {
      expect(() => validateBinaryString('1')).not.toThrow();
    });

    it('should not throw for a long binary string', () => {
      expect(() => validateBinaryString('10110010001110')).not.toThrow();
    });

    it('should not throw for a string of all zeros', () => {
      expect(() => validateBinaryString('0000')).not.toThrow();
    });

    it('should not throw for a string of all ones', () => {
      expect(() => validateBinaryString('1111')).not.toThrow();
    });
  });

  describe('invalid inputs', () => {
    it('should throw TypeError for a string containing "2"', () => {
      expect(() => validateBinaryString('102')).toThrow(TypeError);
    });

    it('should throw TypeError for alphabetic characters', () => {
      expect(() => validateBinaryString('abc')).toThrow(TypeError);
    });

    it('should throw TypeError for a string with spaces', () => {
      expect(() => validateBinaryString('1 0')).toThrow(TypeError);
    });

    it('should throw TypeError for a mixed valid/invalid string', () => {
      expect(() => validateBinaryString('101x01')).toThrow(TypeError);
    });

    it('error message should include the invalid input', () => {
      try {
        validateBinaryString('bad');
      } catch (e) {
        expect((e as Error).message).toContain("'bad'");
      }
    });
  });
});
