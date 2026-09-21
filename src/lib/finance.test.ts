import { describe, expect, it } from 'vitest';
import { amortization, calculateCompound, calculateEMI, calculateSIP, formatIndianNumber, sipYears } from './finance';
describe('EMI calculator', () => {
    it('calculates reference EMI', () => expect(calculateEMI(500000, 8.5, 240)).toBeCloseTo(4336.13, 1));
    it('handles zero rate', () => expect(calculateEMI(120000, 0, 12)).toBeCloseTo(10000, 6));
    it('rejects zero principal', () => expect(calculateEMI(0, 8, 12)).toBe(0));
    it('rejects negative rate', () => expect(calculateEMI(100, -1, 12)).toBe(0));
    it('rejects non-integer tenure', () => expect(calculateEMI(100, 8, 1.5)).toBe(0));
    it('builds full amortization', () => expect(amortization(100000, 10, 12)).toHaveLength(12));
    it('amortization closes balance', () => expect(amortization(100000, 10, 12).at(-1)?.closingBalance).toBeCloseTo(0, 4));
    it('formats lakh values', () => expect(formatIndianNumber(2500000)).toBe('25,00,000'));
    it('formats crore values', () => expect(formatIndianNumber(100000000)).toBe('10,00,00,000'));
    it('formats decimals', () => expect(formatIndianNumber(1234.56)).toBe('1,234.56'));
});
describe('SIP calculator', () => {
    it('uses annuity due', () => expect(calculateSIP(5000, 12, 10)).toBeGreaterThan(5000 * 120));
    it('handles zero return', () => expect(calculateSIP(5000, 0, 2)).toBe(120000));
    it('rejects invalid inputs', () => expect(calculateSIP(-1, 12, 2)).toBe(0));
    it('returns annual growth rows', () => expect(sipYears(5000, 12, 10)).toHaveLength(10));
    it('wealth grows positive', () => expect(sipYears(5000, 12, 10).at(-1)?.wealthGained).toBeGreaterThan(0));
});
describe('compound interest', () => {
    it('annual compounding', () => expect(calculateCompound(100000, 10, 2, 1)).toBeCloseTo(121000, 6));
    it('monthly exceeds annual at positive rate', () => expect(calculateCompound(100000, 10, 2, 12)).toBeGreaterThan(calculateCompound(100000, 10, 2, 1)));
    it('rejects invalid frequency', () => expect(calculateCompound(100000, 10, 2, 0)).toBe(0));
});

