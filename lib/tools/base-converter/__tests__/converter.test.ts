import { describe, it, expect } from 'vitest';
import {
  parseToBigInt,
  formatFromBigInt,
  computeBitwise,
  get32Bits,
  toggleBit,
} from '../converter';

describe('Base Converter & Bitwise Logic', () => {
  it('parses valid inputs across different numeric bases', () => {
    expect(parseToBigInt('42', 10)).toBe(BigInt(42));
    expect(parseToBigInt('0x2A', 16)).toBe(BigInt(42));
    expect(parseToBigInt('2a', 16)).toBe(BigInt(42));
    expect(parseToBigInt('0b101010', 2)).toBe(BigInt(42));
    expect(parseToBigInt('101010', 2)).toBe(BigInt(42));
    expect(parseToBigInt('0o52', 8)).toBe(BigInt(42));
    expect(parseToBigInt('52', 8)).toBe(BigInt(42));
  });

  it('rejects invalid inputs gracefully with null', () => {
    expect(parseToBigInt('abc', 10)).toBeNull();
    expect(parseToBigInt('0xG1', 16)).toBeNull();
    expect(parseToBigInt('0b1020', 2)).toBeNull();
    expect(parseToBigInt('0o89', 8)).toBeNull();
    expect(parseToBigInt('', 10)).toBeNull();
  });

  it('formats BigInt into all base strings', () => {
    const formatted = formatFromBigInt(BigInt(255));
    expect(formatted.decimal).toBe('255');
    expect(formatted.hex).toBe('0xFF');
    expect(formatted.octal).toBe('0o377');
    expect(formatted.binary.endsWith('11111111')).toBe(true);
    expect(formatted.binary.length).toBe(34); // '0b' + 32 digits
  });

  it('computes bitwise AND, OR, XOR, and NOT correctly', () => {
    const a = BigInt(12); // 0b1100
    const b = BigInt(10); // 0b1010

    const results = computeBitwise(a, b);

    expect(results.and.decimal).toBe('8'); // 0b1000
    expect(results.or.decimal).toBe('14'); // 0b1110
    expect(results.xor.decimal).toBe('6'); // 0b0110
    expect(results.not.hex).toBe('0xFFFFFFF3'); // ~12 em 32-bit uint
  });

  it('extracts and toggles 32 bits correctly', () => {
    const val = BigInt(1); // bit 0 = 1, outros = 0
    const bits = get32Bits(val);

    expect(bits).toHaveLength(32);
    expect(bits[31]).toBe(true); // bit 0 está no final do array (LSB)
    expect(bits[0]).toBe(false); // bit 31 é false (MSB)

    const toggled = toggleBit(val, 0); // desliga bit 0
    expect(toggled).toBe(BigInt(0));

    const toggledBit3 = toggleBit(BigInt(0), 3); // liga bit 3 (2^3 = 8)
    expect(toggledBit3).toBe(BigInt(8));
  });
});
