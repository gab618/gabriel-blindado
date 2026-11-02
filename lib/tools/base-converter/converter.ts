export interface BaseValues {
  decimal: string;
  hex: string;
  binary: string;
  octal: string;
}

export interface BitwiseResults {
  and: BaseValues;
  or: BaseValues;
  xor: BaseValues;
  not: BaseValues;
}

/**
 * Converte um BigInt para representações nas 4 bases
 */
export function formatFromBigInt(value: bigint): BaseValues {
  // Trunca para representação de 32 bits sem sinal para binário e hex padronizados
  const uint32 = BigInt.asUintN(32, value);

  return {
    decimal: value.toString(10),
    hex: '0x' + uint32.toString(16).toUpperCase(),
    binary: '0b' + uint32.toString(2).padStart(32, '0'),
    octal: '0o' + uint32.toString(8),
  };
}

/**
 * Limpa e faz parse de uma entrada de qualquer base para BigInt
 */
export function parseToBigInt(input: string, base: 2 | 8 | 10 | 16): bigint | null {
  const cleaned = input.trim().replace(/[\s_]/g, '');
  if (!cleaned) return null;

  try {
    if (base === 16) {
      const stripped = cleaned.replace(/^0x/i, '');
      if (!/^[0-9a-fA-F]+$/.test(stripped)) return null;
      return BigInt('0x' + stripped);
    }

    if (base === 2) {
      const stripped = cleaned.replace(/^0b/i, '');
      if (!/^[01]+$/.test(stripped)) return null;
      return BigInt('0b' + stripped);
    }

    if (base === 8) {
      const stripped = cleaned.replace(/^0o/i, '');
      if (!/^[0-7]+$/.test(stripped)) return null;
      return BigInt('0o' + stripped);
    }

    // Base 10
    if (!/^-?[0-9]+$/.test(cleaned)) return null;
    return BigInt(cleaned);
  } catch {
    return null;
  }
}

/**
 * Executa operações bitwise de 32 bits entre dois operandos
 */
export function computeBitwise(a: bigint, b: bigint): BitwiseResults {
  const a32 = BigInt.asUintN(32, a);
  const b32 = BigInt.asUintN(32, b);

  return {
    and: formatFromBigInt(a32 & b32),
    or: formatFromBigInt(a32 | b32),
    xor: formatFromBigInt(a32 ^ b32),
    not: formatFromBigInt(~a32),
  };
}

/**
 * Retorna uma lista de 32 booleans (bits) do MSB (bit 31) ao LSB (bit 0)
 */
export function get32Bits(value: bigint): boolean[] {
  const uint32 = BigInt.asUintN(32, value);
  const bits: boolean[] = [];

  for (let i = 31; i >= 0; i--) {
    const bit = (uint32 >> BigInt(i)) & BigInt(1);
    bits.push(bit === BigInt(1));
  }

  return bits;
}

/**
 * Alterna (toggle) um bit específico (0 a 31) em um valor BigInt
 */
export function toggleBit(value: bigint, bitIndex: number): bigint {
  if (bitIndex < 0 || bitIndex > 31) return value;
  const mask = BigInt(1) << BigInt(bitIndex);
  return value ^ mask;
}
