/**
 * Strict financial arithmetic utilities using decimal.js.
 * All monetary values must be processed through these helpers
 * to avoid IEEE 754 floating-point rounding errors.
 */
import Decimal from "decimal.js";

// Global config: 20 significant digits, banker's ROUND_HALF_UP for currency
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/** Internal: convert any numeric input to a Decimal */
function d(value: number | string | null | undefined): Decimal {
  if (value == null || value === "") return new Decimal(0);
  try {
    return new Decimal(value);
  } catch {
    return new Decimal(0);
  }
}

/** Safely parse a user-input string/number into a plain JS number. */
export function parseAmount(value: string | number | null | undefined): number {
  return d(value).toNumber();
}

/** Add two financial values. */
export function add(a: number, b: number): number {
  return d(a).plus(d(b)).toNumber();
}

/** Subtract b from a. */
export function sub(a: number, b: number): number {
  return d(a).minus(d(b)).toNumber();
}

/** Multiply two financial values. */
export function mul(a: number, b: number): number {
  return d(a).times(d(b)).toNumber();
}

/** Divide a by b. Throws on division by zero. */
export function div(a: number, b: number): number {
  if (b === 0) throw new Error("Division by zero in financial calculation");
  return d(a).dividedBy(d(b)).toNumber();
}

/** Negate a financial value. */
export function neg(a: number): number {
  return d(a).negated().toNumber();
}

/** Sum an array of financial values. */
export function sum(values: (number | null | undefined)[]): number {
  return values.reduce<Decimal>(
    (acc, val) => acc.plus(d(val)),
    new Decimal(0)
  ).toNumber();
}

/** Format a financial value to exactly 2 decimal places (string). */
export function toFixed2(value: number): string {
  return d(value).toFixed(2);
}
