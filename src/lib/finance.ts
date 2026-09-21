export const formatIndianNumber = (value: number, maximumFractionDigits = 2): string => new Intl.NumberFormat('en-IN', { maximumFractionDigits, minimumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
export const formatINR = (value: number): string => `₹${formatIndianNumber(value, 2)}`;
export interface EmiResult {
    emi: number;
    totalPayment: number;
    totalInterest: number;
}
export interface EmiRow {
    month: number;
    openingBalance: number;
    emi: number;
    principal: number;
    interest: number;
    closingBalance: number;
}
export function calculateEMI(principal: number, annualRate: number, months: number): number {
    if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isInteger(months) || principal <= 0 || months <= 0)
        return 0;
    if (annualRate === 0)
        return principal / months;
    if (annualRate < 0)
        return 0;
    const r = annualRate / 12 / 100;
    const factor = (1 + r) ** months;
    return principal * r * factor / (factor - 1);
}
export function emiSummary(principal: number, annualRate: number, months: number): EmiResult {
    const emi = calculateEMI(principal, annualRate, months);
    const totalPayment = emi * months;
    return { emi, totalPayment, totalInterest: Math.max(0, totalPayment - principal) };
}
export function amortization(principal: number, annualRate: number, months: number): EmiRow[] {
    const emi = calculateEMI(principal, annualRate, months);
    if (!emi)
        return [];
    const r = annualRate / 12 / 100;
    let balance = principal;
    return Array.from({ length: months }, (_, i) => { const openingBalance = balance; const interest = annualRate === 0 ? 0 : balance * r; const principalPart = Math.min(Math.max(0, emi - interest), balance); balance = Math.max(0, balance - principalPart); return { month: i + 1, openingBalance, emi, principal: principalPart, interest, closingBalance: balance }; });
}
export interface SipYear {
    year: number;
    invested: number;
    futureValue: number;
    wealthGained: number;
}
export function calculateSIP(monthly: number, annualRate: number, years: number): number {
    if (!Number.isFinite(monthly) || !Number.isFinite(annualRate) || !Number.isFinite(years) || monthly <= 0 || years <= 0)
        return 0;
    const n = Math.round(years * 12), r = annualRate / 12 / 100;
    if (r === 0)
        return monthly * n;
    return monthly * (((1 + r) ** n - 1) / r) * (1 + r);
}
export function sipYears(monthly: number, annualRate: number, years: number): SipYear[] {
    const totalYears = Math.floor(years);
    return Array.from({ length: totalYears }, (_, i) => { const year = i + 1; const futureValue = calculateSIP(monthly, annualRate, year); const invested = monthly * year * 12; return { year, invested, futureValue, wealthGained: futureValue - invested }; });
}
export interface CompoundYear {
    year: number;
    value: number;
}
export function calculateCompound(principal: number, annualRate: number, years: number, frequency: number): number {
    if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(years) || !Number.isFinite(frequency) || principal <= 0 || years <= 0 || frequency <= 0)
        return 0;
    return principal * (1 + annualRate / 100 / frequency) ** (frequency * years);
}
export function compoundGrowth(principal: number, annualRate: number, years: number, frequency: number): CompoundYear[] {
    return Array.from({ length: Math.floor(years) + 1 }, (_, year) => ({ year, value: calculateCompound(principal, annualRate, year || 0, frequency) || principal }));
}

