// lib/core/strategies/HighPriorityStrategy.ts
import { ICostStrategy } from './ICostStrategy';

export class HighPriorityStrategy implements ICostStrategy {
  calculateCost(totalWeight: number): number {
    return totalWeight * 5.50; // Tarifa para prioridad alta
  }
}