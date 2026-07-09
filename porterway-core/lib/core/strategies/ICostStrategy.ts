// lib/core/strategies/ICostStrategy.ts
export interface ICostStrategy {
  calculateCost(totalWeight: number): number;
}