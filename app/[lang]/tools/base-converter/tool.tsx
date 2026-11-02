'use client';

import 'client-only';
import React, { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';
import {
  parseToBigInt,
  formatFromBigInt,
  computeBitwise,
  get32Bits,
  toggleBit,
  type BaseValues,
} from '@/lib/tools/base-converter/converter';
import { Field } from '@/components/ui/Field';

export interface BaseConverterToolProps {
  labels: Dictionary['tools']['baseConverter'];
}

export function BaseConverterTool({ labels }: BaseConverterToolProps) {
  const [currentValue, setCurrentValue] = useState<bigint>(BigInt(42));
  const [operandB, setOperandB] = useState<bigint>(BigInt(15));
  const [errorField, setErrorField] = useState<string | null>(null);

  const formatted: BaseValues = formatFromBigInt(currentValue);
  const bitwise = computeBitwise(currentValue, operandB);
  const bits = get32Bits(currentValue);

  function handleInputChange(val: string, base: 2 | 8 | 10 | 16, fieldName: string) {
    if (!val.trim()) {
      setErrorField(null);
      return;
    }

    const parsed = parseToBigInt(val, base);
    if (parsed === null) {
      setErrorField(fieldName);
    } else {
      setErrorField(null);
      setCurrentValue(parsed);
    }
  }

  function handleBitClick(bitIndex: number) {
    const updated = toggleBit(currentValue, bitIndex);
    setCurrentValue(updated);
  }

  function handleOperandBChange(val: string) {
    const parsed = parseToBigInt(val, 10);
    if (parsed !== null) {
      setOperandB(parsed);
    }
  }

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* 1. Grade de Entradas das Bases */}
      <section className="border border-border p-4 bg-code-bg/30 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="input-dec"
            label={labels.decimalLabel}
            error={errorField === 'dec' ? labels.invalidInput : undefined}
          >
            <input
              id="input-dec"
              type="text"
              value={formatted.decimal}
              onChange={(e) => handleInputChange(e.target.value, 10, 'dec')}
              className="w-full border border-border bg-bg px-2.5 py-1.5 text-fg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-link"
            />
          </Field>

          <Field
            id="input-hex"
            label={labels.hexLabel}
            error={errorField === 'hex' ? labels.invalidInput : undefined}
          >
            <input
              id="input-hex"
              type="text"
              value={formatted.hex}
              onChange={(e) => handleInputChange(e.target.value, 16, 'hex')}
              className="w-full border border-border bg-bg px-2.5 py-1.5 text-fg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-link"
            />
          </Field>

          <Field
            id="input-bin"
            label={labels.binaryLabel}
            error={errorField === 'bin' ? labels.invalidInput : undefined}
          >
            <input
              id="input-bin"
              type="text"
              value={formatted.binary}
              onChange={(e) => handleInputChange(e.target.value, 2, 'bin')}
              className="w-full border border-border bg-bg px-2.5 py-1.5 text-fg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-link"
            />
          </Field>

          <Field
            id="input-oct"
            label={labels.octalLabel}
            error={errorField === 'oct' ? labels.invalidInput : undefined}
          >
            <input
              id="input-oct"
              type="text"
              value={formatted.octal}
              onChange={(e) => handleInputChange(e.target.value, 8, 'oct')}
              className="w-full border border-border bg-bg px-2.5 py-1.5 text-fg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-link"
            />
          </Field>
        </div>
      </section>

      {/* 2. Visualizador Interativo de 32 Bits */}
      <section className="border border-border p-4 bg-bg space-y-3">
        <div className="font-bold uppercase tracking-wider text-fg border-b border-border pb-1">
          {labels.bitViewer}
        </div>
        <p className="text-muted text-[11px]">{labels.bitToggles}</p>

        {/* 4 grupos de 8 bits (32 bits no total) */}
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 pt-1 overflow-x-auto">
          {[0, 1, 2, 3].map((byteIndex) => {
            const byteBits = bits.slice(byteIndex * 8, (byteIndex + 1) * 8);

            return (
              <div
                key={byteIndex}
                className="border border-border p-1.5 bg-code-bg/40 flex flex-col items-center gap-1"
              >
                <div className="text-[10px] text-muted">
                  Byte {3 - byteIndex}
                </div>
                <div className="flex gap-1">
                  {byteBits.map((isSet, idxInByte) => {
                    const actualBitIndex = 31 - (byteIndex * 8 + idxInByte);

                    return (
                      <button
                        key={actualBitIndex}
                        type="button"
                        onClick={() => handleBitClick(actualBitIndex)}
                        title={`Bit ${actualBitIndex} (${isSet ? '1' : '0'})`}
                        className={`w-5 h-6 text-center font-bold text-xs border transition-colors ${
                          isSet
                            ? 'bg-link text-white border-link'
                            : 'bg-bg text-muted border-border hover:border-fg'
                        }`}
                      >
                        {isSet ? '1' : '0'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Operações Bitwise */}
      <section className="border border-border p-4 bg-code-bg/30 space-y-3">
        <div className="font-bold uppercase tracking-wider text-fg border-b border-border pb-1">
          {labels.bitwiseOperations}
        </div>

        <div className="max-w-xs">
          <Field id="operand-b" label={labels.operandB}>
            <input
              id="operand-b"
              type="text"
              value={operandB.toString(10)}
              onChange={(e) => handleOperandBChange(e.target.value)}
              className="w-full border border-border bg-bg px-2.5 py-1.5 text-fg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-link"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="border border-border p-2.5 bg-bg space-y-1">
            <span className="font-bold text-fg block">{labels.andResult}</span>
            <div className="text-muted text-[11px] truncate">Dec: {bitwise.and.decimal}</div>
            <div className="text-muted text-[11px] truncate">Hex: {bitwise.and.hex}</div>
            <div className="text-muted text-[11px] truncate">Bin: {bitwise.and.binary}</div>
          </div>

          <div className="border border-border p-2.5 bg-bg space-y-1">
            <span className="font-bold text-fg block">{labels.orResult}</span>
            <div className="text-muted text-[11px] truncate">Dec: {bitwise.or.decimal}</div>
            <div className="text-muted text-[11px] truncate">Hex: {bitwise.or.hex}</div>
            <div className="text-muted text-[11px] truncate">Bin: {bitwise.or.binary}</div>
          </div>

          <div className="border border-border p-2.5 bg-bg space-y-1">
            <span className="font-bold text-fg block">{labels.xorResult}</span>
            <div className="text-muted text-[11px] truncate">Dec: {bitwise.xor.decimal}</div>
            <div className="text-muted text-[11px] truncate">Hex: {bitwise.xor.hex}</div>
            <div className="text-muted text-[11px] truncate">Bin: {bitwise.xor.binary}</div>
          </div>

          <div className="border border-border p-2.5 bg-bg space-y-1">
            <span className="font-bold text-fg block">{labels.notResult}</span>
            <div className="text-muted text-[11px] truncate">Dec: {bitwise.not.decimal}</div>
            <div className="text-muted text-[11px] truncate">Hex: {bitwise.not.hex}</div>
            <div className="text-muted text-[11px] truncate">Bin: {bitwise.not.binary}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
