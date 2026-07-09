// lib/core/strategies/StandardPriorityStrategy.ts
import { ICostStrategy } from './ICostStrategy';

export class StandardPriorityStrategy implements ICostStrategy {
  calculateCost(totalWeight: number): number {
    return totalWeight * 2.50; // Tarifa para prioridad baja/media
  }
}